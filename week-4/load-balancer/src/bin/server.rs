use axum::{
    extract::State,
    http::StatusCode,
    response::Json,
    routing::{get, post},
    Router,
};
use serde::{Deserialize, Serialize};
use std::{
    collections::HashMap,
    sync::Arc,
    time::{Duration, SystemTime},
};
use tokio::sync::RwLock;
use tower_http::cors::CorsLayer;
use uuid::Uuid;

// Data structures for our load balancer
#[derive(Clone, Serialize, Deserialize, Debug)]
struct WorkerNode {
    id: String,
    address: String,
    active_requests: usize,
    total_requests: usize,
    is_healthy: bool,
    last_heartbeat: SystemTime,
}

#[derive(Clone, Serialize)]
struct LoadBalancerStats {
    nodes: Vec<WorkerNode>,
    total_requests: usize,
    active_nodes: usize,
}

#[derive(Serialize, Deserialize)]
struct IncomingRequest {
    data: String,
}

#[derive(Serialize)]
struct RequestResponse {
    request_id: String,
    node_id: String,
    result: String,
}

// Shared state across all threads
type SharedState = Arc<RwLock<AppState>>;

struct AppState {
    nodes: HashMap<String, WorkerNode>,
    total_requests: usize,
    round_robin_index: usize,
}

impl AppState {
    fn new() -> Self {
        Self {
            nodes: HashMap::new(),
            total_requests: 0,
            round_robin_index: 0,
        }
    }

    // Round-robin algorithm: picks next available node
    fn select_node(&mut self) -> Option<String> {
        let active_nodes: Vec<_> = self
            .nodes
            .values()
            .filter(|n| n.is_healthy)
            .collect();

        if active_nodes.is_empty() {
            return None;
        }

        self.round_robin_index = (self.round_robin_index + 1) % active_nodes.len();
        Some(active_nodes[self.round_robin_index].id.clone())
    }
}

#[tokio::main]
async fn main() {
    // Initialize logging
    tracing_subscriber::fmt::init();

    // Create shared state wrapped in Arc<RwLock<>> for thread-safe access
let state: SharedState = Arc::new(RwLock::new(AppState::new()));
    let state_clone = state.clone();

    // Spawn background task to check node health
    tokio::spawn(async move {
        health_check_loop(state_clone).await;
    });

    // Build our API routes
    let app = Router::new()
        .route("/process", post(handle_request))
        .route("/stats", get(get_stats))
        .route("/register", post(register_node))
        .route("/heartbeat", post(heartbeat))
        .layer(CorsLayer::permissive())
        .with_state(state);

    let listener = tokio::net::TcpListener::bind("127.0.0.1:8080")
        .await
        .unwrap();

    println!("🚀 Load Balancer running on http://127.0.0.1:8080");
    println!("📊 Stats available at http://127.0.0.1:8080/stats");
    println!("\n💡 Start worker nodes with: cargo run --bin node -- --port <PORT>");

    axum::serve(listener, app).await.unwrap();
}

// Handle incoming work requests
async fn handle_request(
    State(state): State<SharedState>,
    Json(payload): Json<IncomingRequest>,
) -> Result<Json<RequestResponse>, StatusCode> {
    let request_id = Uuid::new_v4().to_string();

    // Lock state for reading/writing
    let mut state_guard = state.write().await;
    state_guard.total_requests += 1;

    // Select a node using round-robin
    let node_id = match state_guard.select_node() {
        Some(id) => id,
        None => return Err(StatusCode::SERVICE_UNAVAILABLE),
    };

    // Update node stats
    if let Some(node) = state_guard.nodes.get_mut(&node_id) {
        node.active_requests += 1;
        node.total_requests += 1;
    }

    let node_address = state_guard.nodes.get(&node_id).unwrap().address.clone();
    drop(state_guard); // Release lock before network call

    // Forward request to worker node
    let client = reqwest::Client::new();
    let response = client
        .post(format!("{}/work", node_address))
        .json(&payload)
        .timeout(Duration::from_secs(5))
        .send()
        .await;

    // Update active request count
    let mut state_guard = state.write().await;
    if let Some(node) = state_guard.nodes.get_mut(&node_id) {
        node.active_requests = node.active_requests.saturating_sub(1);
    }

    match response {
        Ok(res) => {
            let result = res.text().await.unwrap_or_else(|_| "Error".to_string());
            Ok(Json(RequestResponse {
                request_id,
                node_id,
                result,
            }))
        }
        Err(_) => Err(StatusCode::INTERNAL_SERVER_ERROR),
    }
}

// Get current load balancer statistics
async fn get_stats(State(state): State<SharedState>) -> Json<LoadBalancerStats> {
    let state_guard = state.read().await;
    let nodes: Vec<WorkerNode> = state_guard.nodes.values().cloned().collect();
    let active_nodes = nodes.iter().filter(|n| n.is_healthy).count();

    Json(LoadBalancerStats {
        nodes,
        total_requests: state_guard.total_requests,
        active_nodes,
    })
}

// Register a new worker node
async fn register_node(
    State(state): State<SharedState>,
    Json(node): Json<WorkerNode>,
) -> StatusCode {
    let mut state_guard = state.write().await;
    println!("✅ Registered node: {} at {}", node.id, node.address);
    state_guard.nodes.insert(node.id.clone(), node);
    StatusCode::OK
}

// Receive heartbeat from worker node
async fn heartbeat(State(state): State<SharedState>, Json(node_id): Json<String>) -> StatusCode {
    let mut state_guard = state.write().await;
    if let Some(node) = state_guard.nodes.get_mut(&node_id) {
        node.last_heartbeat = SystemTime::now();
        node.is_healthy = true;
    }
    StatusCode::OK
}

// Background task: check node health every 5 seconds
async fn health_check_loop(state: SharedState) {
    loop {
        tokio::time::sleep(Duration::from_secs(5)).await;

        let mut state_guard = state.write().await;
        let now = SystemTime::now();

        for node in state_guard.nodes.values_mut() {
            if let Ok(elapsed) = now.duration_since(node.last_heartbeat) {
                if elapsed > Duration::from_secs(15) {
                    if node.is_healthy {
                        println!("⚠️  Node {} marked unhealthy", node.id);
                    }
                    node.is_healthy = false;
                }
            }
        }
    }
}

