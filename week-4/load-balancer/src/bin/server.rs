// Load Balancer Server - The "Boss" that distributes work to workers
// This file creates a web server that manages multiple worker nodes

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
// WorkerNode: Represents one worker that can do tasks
// Think of it like an employee in a company - we track their info
#[derive(Clone, Serialize, Deserialize, Debug)]
struct WorkerNode {
    id: String,                     // Unique name for this worker (e.g., "node-3001")
    address: String,                // Where to find this worker (e.g., "http://127.0.0.1:3001")
    active_requests: usize,         // How many tasks they're working on RIGHT NOW
    total_requests: usize,          // Total tasks they've ever completed
    is_healthy: bool,               // Are they alive and responding?
    last_heartbeat: SystemTime,     // When did they last say "I'm alive"?
}

// LoadBalancerStats: All the info we send to the frontend dashboard
#[derive(Clone, Serialize)]
struct LoadBalancerStats {
    nodes: Vec<WorkerNode>,         // List of all workers
    total_requests: usize,          // Total tasks processed by load balancer
    active_nodes: usize,            // How many healthy workers right now
}

// IncomingRequest: What the frontend sends us when user clicks "Send Request"
// MUST derive both Serialize and Deserialize because we:
// - Deserialize: Receive JSON from frontend
// - Serialize: Forward JSON to worker nodes
#[derive(Serialize, Deserialize)]
struct IncomingRequest {
    data: String,                   // The actual task to do (e.g., "process-123")
}

// RequestResponse: What we send back after processing
#[derive(Serialize)]
struct RequestResponse {
    request_id: String,             // Unique ID for this request (so we can track it)
    node_id: String,                // Which worker handled it
    result: String,                 // What the worker returned
}

// Why Arc<RwLock<AppState>>?
// - Arc: Allows multiple threads to "own" the same data (Atomic Reference Counting)
//        Think: Multiple people can read the same book at the library
// - RwLock: Allows MANY readers OR ONE writer at a time
//        Think: Many can read the book, but only one can write in it
type SharedState = Arc<RwLock<AppState>>;

// AppState: The "brain" of our load balancer - stores everything
struct AppState {
    nodes: HashMap<String, WorkerNode>,  // All workers (key: node_id, value: worker info)
    total_requests: usize,               // Counter for total requests
    round_robin_index: usize,            // Which worker's turn is it? (0, 1, 2...)
}

impl AppState {
    // Create new empty state
    fn new() -> Self {
        Self {
            nodes: HashMap::new(),
            total_requests: 0,
            round_robin_index: 0,
        }
    }

    // ROUND-ROBIN ALGORITHM: Pick the next worker in line
    // How it works: If we have 3 workers, we rotate: 0 → 1 → 2 → 0 → 1 → 2...
    // This ensures FAIR distribution of work
    fn select_node(&mut self) -> Option<String> {
        // Step 1: Get ONLY healthy workers (no point sending work to dead workers)
        let active_nodes: Vec<_> = self
            .nodes               // Look at all workers
            .values()            // Get their info
            .filter(|n| n.is_healthy)  // Keep only healthy ones
            .collect();          // Put them in a list

        // Step 2: If no healthy workers, we can't do anything
        if active_nodes.is_empty() {
            return None;  // Return "nothing" (None means no result)
        }

        // Step 3: Pick the next worker using modulo math
        // Example: If we have 3 workers (indices 0,1,2)
        //   - round_robin_index = 0: next is 1 (1 % 3 = 1)
        //   - round_robin_index = 1: next is 2 (2 % 3 = 2)
        //   - round_robin_index = 2: next is 0 (3 % 3 = 0) ← wraps around!
        self.round_robin_index = (self.round_robin_index + 1) % active_nodes.len();
        
        // Step 4: Return the ID of the selected worker
        Some(active_nodes[self.round_robin_index].id.clone())
    }
}

#[tokio::main]  // This macro makes our main function async-capable
async fn main() {
    // Step 1: Initialize logging (so we can see debug messages)
    tracing_subscriber::fmt::init();

    // Step 2: Create the shared state
    // Arc::new wraps it in reference counting
    // RwLock::new makes it safe for multiple threads
    // We explicitly create SharedState here instead of using Default trait
    let state: SharedState = Arc::new(RwLock::new(AppState::new()));
    let state_clone = state.clone();  // Clone the Arc (increases reference count)

    // Step 3: Spawn a background task to check if workers are alive
    // tokio::spawn runs this in a SEPARATE thread
    // It won't block the main server from handling requests
    tokio::spawn(async move {
        health_check_loop(state_clone).await;  // Runs forever, checking health
    });

    // Step 4: Build our API routes (like building a menu for a restaurant)
    let app = Router::new()
        // POST /process - Main endpoint: Send work here to be distributed
        .route("/process", post(handle_request))
        
        // GET /stats - Dashboard calls this to get current state
        .route("/stats", get(get_stats))
        
        // POST /register - Workers call this when they start up
        .route("/register", post(register_node))
        
        // POST /heartbeat - Workers call this every 5 seconds to say "I'm alive"
        .route("/heartbeat", post(heartbeat))
        
        // POST /deregister - Workers call this when shutting down
        .route("/deregister", post(deregister_node))
        
        // Enable CORS so frontend can call us from different port
        .layer(CorsLayer::permissive())
        
        // Give all routes access to shared state
        .with_state(state);

    // Step 5: Bind to port 8080 and start listening
    let listener = tokio::net::TcpListener::bind("127.0.0.1:8080")
        .await
        .unwrap();

    println!("🚀 Load Balancer running on http://127.0.0.1:8080");
    println!("📊 Stats available at http://127.0.0.1:8080/stats");
    println!("\n💡 Start worker nodes with: cargo run --bin node -- --port <PORT>");

    // Step 6: Serve requests forever (this blocks until server stops)
    axum::serve(listener, app).await.unwrap();
}

// Handle POST /process - This is where actual work distribution happens!
// YES, we ARE actually sending requests to worker nodes
async fn handle_request(
    State(state): State<SharedState>,  // Get access to shared state
    Json(payload): Json<IncomingRequest>,  // Get JSON from request body
) -> Result<Json<RequestResponse>, StatusCode> {
    
    // Step 1: Generate unique ID for this request (for tracking)
    let request_id = Uuid::new_v4().to_string();

    // Step 2: Lock state for WRITING (no one else can write while we do this)
    // Why? We're about to modify total_requests counter
    let mut state_guard = state.write().await;
    state_guard.total_requests += 1;  // Increment counter

    // Step 3: Use round-robin to select which worker gets this request
    let node_id = match state_guard.select_node() {
        Some(id) => id,                              // Got a worker!
        None => return Err(StatusCode::SERVICE_UNAVAILABLE),  // No healthy workers
    };

    // Step 4: Update the selected worker's stats
    if let Some(node) = state_guard.nodes.get_mut(&node_id) {
        node.active_requests += 1;    // This worker now has 1 more active task
        node.total_requests += 1;     // Increment their lifetime counter
    }

    // Step 5: Get worker's address and release the lock
    // Why release? Because the next step is a network call which is SLOW
    // We don't want to hold the lock during slow operations
    let node_address = state_guard.nodes.get(&node_id).unwrap().address.clone();
    drop(state_guard);  // Explicitly release lock (happens automatically too)

    // Step 6: ACTUALLY SEND REQUEST TO WORKER (HTTP POST)
    // This is the real work distribution happening!
    let client = reqwest::Client::new();  // Create HTTP client
    let response = client
        .post(format!("{}/work", node_address))  // POST to worker's /work endpoint
        .json(&payload)                          // Send the task data as JSON
        .timeout(Duration::from_secs(5))         // Give up after 5 seconds
        .send()                                  // Send the request
        .await;                                  // Wait for response (non-blocking)

    // Step 7: Decrement active_requests (worker finished the task)
    let mut state_guard = state.write().await;
    if let Some(node) = state_guard.nodes.get_mut(&node_id) {
        node.active_requests = node.active_requests.saturating_sub(1);  // Subtract 1 (min 0)
    }

    // Step 8: Return result or error
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

// Handle GET /stats - Send current state to frontend
async fn get_stats(State(state): State<SharedState>) -> Json<LoadBalancerStats> {
    // Lock for READING (multiple threads can read simultaneously)
    let state_guard = state.read().await;
    
    // Collect all workers into a list
    let nodes: Vec<WorkerNode> = state_guard.nodes.values().cloned().collect();
    
    // Count how many are healthy
    let active_nodes = nodes.iter().filter(|n| n.is_healthy).count();

    // Return stats as JSON
    Json(LoadBalancerStats {
        nodes,
        total_requests: state_guard.total_requests,
        active_nodes,
    })
}

// Handle POST /register - Worker is joining the team!
async fn register_node(
    State(state): State<SharedState>,
    Json(node): Json<WorkerNode>,
) -> StatusCode {
    let mut state_guard = state.write().await;
    println!("✅ Registered node: {} at {}", node.id, node.address);
    
    // Add worker to our HashMap (this makes it available for work)
    state_guard.nodes.insert(node.id.clone(), node);
    
    StatusCode::OK
}

// Handle POST /heartbeat - Worker saying "I'm still alive!"
async fn heartbeat(
    State(state): State<SharedState>,
    Json(node_id): Json<String>,
) -> StatusCode {
    let mut state_guard = state.write().await;
    
    // Update last_heartbeat timestamp
    if let Some(node) = state_guard.nodes.get_mut(&node_id) {
        node.last_heartbeat = SystemTime::now();
        node.is_healthy = true;  // Mark as healthy
    }
    
    StatusCode::OK
}

// Handle POST /deregister - Worker is shutting down gracefully
async fn deregister_node(
    State(state): State<SharedState>,
    Json(node_id): Json<String>,
) -> StatusCode {
    let mut state_guard = state.write().await;
    
    // IMMEDIATELY remove from nodes HashMap
    // This means NEW requests won't go to this node
    if state_guard.nodes.remove(&node_id).is_some() {
        println!("👋 Node {} deregistered gracefully", node_id);
    }
    
    StatusCode::OK
}

// This runs FOREVER in a background thread
// Every 5 seconds, it checks if workers are still alive
async fn health_check_loop(state: SharedState) {
    loop {
        // Sleep for 5 seconds (non-blocking, allows other tasks to run)
        tokio::time::sleep(Duration::from_secs(5)).await;

        // Lock for writing (we might modify is_healthy)
        let mut state_guard = state.write().await;
        let now = SystemTime::now();

        // Check each worker
        for node in state_guard.nodes.values_mut() {
            // How long since last heartbeat?
            if let Ok(elapsed) = now.duration_since(node.last_heartbeat) {
                // If more than 10 seconds, mark as unhealthy
                // Reduced from 15s for faster detection!
                if elapsed > Duration::from_secs(10) {
                    if node.is_healthy {
                        println!("⚠️  Node {} marked unhealthy (no heartbeat)", node.id);
                    }
                    node.is_healthy = false;
                }
            }
        }
    }
}