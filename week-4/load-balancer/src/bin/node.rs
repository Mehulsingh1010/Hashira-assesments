use axum::{
    extract::Json,
    routing::post,
    Router,
};
use clap::Parser;
use serde::{Deserialize, Serialize};
use std::time::{Duration, SystemTime};
use tokio::time;

// CLI arguments using Clap
#[derive(Parser, Debug)]
#[command(name = "Worker Node")]
#[command(about = "A worker node for the load balancer", long_about = None)]
struct Args {
    /// Port to run this worker node on
    #[arg(short, long)]
    port: u16,

    /// Optional custom node ID
    #[arg(short, long)]
    id: Option<String>,
}

#[derive(Clone, Serialize, Deserialize, Debug)]
struct WorkerNode {
    id: String,
    address: String,
    active_requests: usize,
    total_requests: usize,
    is_healthy: bool,
    last_heartbeat: SystemTime,
}

#[derive(Deserialize)]
struct WorkRequest {
    data: String,
}

#[tokio::main]
async fn main() {
    // Parse command line arguments
    let args = Args::parse();
    
    let node_id = args
        .id
        .unwrap_or_else(|| format!("node-{}", args.port));
    
    let address = format!("http://127.0.0.1:{}", args.port);
    
    println!("🔧 Worker Node Starting...");
    println!("   ID: {}", node_id);
    println!("   Address: {}", address);

    // Register with load balancer
    let registration_success = register_with_load_balancer(&node_id, &address).await;
    
    if !registration_success {
        eprintln!("❌ Failed to register with load balancer. Is it running?");
        eprintln!("   Start the load balancer first: cargo run --bin server");
        return;
    }

    // Clone for heartbeat task
    let heartbeat_node_id = node_id.clone();
    
    // Spawn heartbeat task in background
    tokio::spawn(async move {
        send_heartbeat_loop(heartbeat_node_id).await;
    });

    // Setup API routes for this worker
    let app = Router::new()
        .route("/work", post(handle_work));

    let listener = tokio::net::TcpListener::bind(format!("127.0.0.1:{}", args.port))
        .await
        .unwrap();

    println!("✅ Worker node '{}' ready and registered!", node_id);
    println!("   Listening on port {}", args.port);

    axum::serve(listener, app).await.unwrap();
}

// Register this node with the load balancer
async fn register_with_load_balancer(node_id: &str, address: &str) -> bool {
    let client = reqwest::Client::new();
    
    let node = WorkerNode {
        id: node_id.to_string(),
        address: address.to_string(),
        active_requests: 0,
        total_requests: 0,
        is_healthy: true,
        last_heartbeat: SystemTime::now(),
    };

    match client
        .post("http://127.0.0.1:8080/register")
        .json(&node)
        .timeout(Duration::from_secs(3))
        .send()
        .await
    {
        Ok(response) => response.status().is_success(),
        Err(_) => false,
    }
}

// Handle incoming work requests
async fn handle_work(Json(request): Json<WorkRequest>) -> Json<String> {
    println!("📦 Processing request: {}", request.data);
    
    // Simulate some work being done (replace with real work)
    time::sleep(Duration::from_millis(100)).await;
    
    let result = format!("Processed: {}", request.data.to_uppercase());
    
    Json(result)
}

// Send periodic heartbeat to load balancer
async fn send_heartbeat_loop(node_id: String) {
    let client = reqwest::Client::new();
    
    loop {
        time::sleep(Duration::from_secs(5)).await;
        
        let result = client
            .post("http://127.0.0.1:8080/heartbeat")
            .json(&node_id)
            .timeout(Duration::from_secs(2))
            .send()
            .await;

        match result {
            Ok(_) => println!("💓 Heartbeat sent"),
            Err(e) => eprintln!("❌ Heartbeat failed: {}", e),
        }
    }
}