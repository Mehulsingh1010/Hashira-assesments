// Worker Node - The actual "worker" that does tasks
// This file creates a worker that registers with the load balancer and processes work

use axum::{
    extract::Json,
    routing::post,
    Router,
};
use clap::Parser;
use serde::{Deserialize, Serialize};
use std::time::{Duration, SystemTime};
use tokio::time;
use tokio::signal;  // For graceful shutdown

// ====================================================================================
// CLI ARGUMENTS - Parse what user types in terminal
// ====================================================================================

// Clap is a library that automatically handles command-line arguments
// When you run: cargo run --bin node -- --port 3001
// Clap parses this and creates an Args struct with port=3001

#[derive(Parser, Debug)]
#[command(name = "Worker Node")]
#[command(about = "A worker node for the load balancer", long_about = None)]
struct Args {
    /// Port to run this worker node on
    /// The user MUST provide this: --port 3001
    #[arg(short, long)]
    port: u16,

    /// Optional custom node ID
    /// User can optionally provide: --id "my-fast-worker"
    #[arg(short, long)]
    id: Option<String>,
}

// ====================================================================================
// DATA STRUCTURES - Same as server, so they can talk to each other
// ====================================================================================

#[derive(Clone, Serialize, Deserialize, Debug)]
struct WorkerNode {
    id: String,
    address: String,
    active_requests: usize,
    total_requests: usize,
    is_healthy: bool,
    last_heartbeat: SystemTime,
}

// The actual work request that comes from load balancer
#[derive(Deserialize)]
struct WorkRequest {
    data: String,  // The task to process
}

// ====================================================================================
// MAIN FUNCTION - Entry point for worker
// ====================================================================================

#[tokio::main]
async fn main() {
    // Step 1: Parse command-line arguments
    // This reads what user typed: cargo run --bin node -- --port 3001 --id "worker1"
    let args = Args::parse();
    
    // Step 2: Create node ID (use custom if provided, otherwise auto-generate)
    let node_id = args
        .id
        .unwrap_or_else(|| format!("node-{}", args.port));
    
    // Step 3: Build the address where this worker will listen
    let address = format!("http://127.0.0.1:{}", args.port);
    
    println!("🔧 Worker Node Starting...");
    println!("   ID: {}", node_id);
    println!("   Address: {}", address);

    // Step 4: Register with load balancer (tell the boss we exist!)
    let registration_success = register_with_load_balancer(&node_id, &address).await;
    
    if !registration_success {
        eprintln!("❌ Failed to register with load balancer. Is it running?");
        eprintln!("   Start the load balancer first: cargo run --bin server");
        return;  // Exit if can't register
    }

    // Step 5: Clone node_id for background tasks
    // Why clone? Because we're moving it into different async tasks
    let heartbeat_node_id = node_id.clone();
    let shutdown_node_id = node_id.clone();
    
    // Step 6: Spawn heartbeat task in background
    // This task runs FOREVER (until program exits)
    // Every 5 seconds, it tells load balancer "I'm alive!"
    let heartbeat_handle = tokio::spawn(async move {
        send_heartbeat_loop(heartbeat_node_id).await;
    });

    // Step 7: Setup graceful shutdown handler
    // This listens for Ctrl+C and cleanly shuts down
    let shutdown_signal = async move {
        signal::ctrl_c().await.expect("Failed to listen for Ctrl+C");
        println!("\n🛑 Shutting down gracefully...");
        
        // Tell load balancer we're leaving (so it stops sending us work)
        deregister_with_load_balancer(&shutdown_node_id).await;
    };

    // Step 8: Setup API routes for this worker
    let app = Router::new()
        .route("/work", post(handle_work));  // POST /work - where work comes in

    // Step 9: Bind to the port specified in CLI
    let listener = tokio::net::TcpListener::bind(format!("127.0.0.1:{}", args.port))
        .await
        .unwrap();

    println!("✅ Worker node '{}' ready and registered!", node_id);
    println!("   Listening on port {}", args.port);
    println!("   Press Ctrl+C to stop\n");

    // Step 10: Serve requests with graceful shutdown
    // This runs until Ctrl+C is pressed
    axum::serve(listener, app)
        .with_graceful_shutdown(shutdown_signal)
        .await
        .unwrap();

    // Step 11: Cancel heartbeat task on shutdown
    heartbeat_handle.abort();
    println!("👋 Worker stopped cleanly");
}

// ====================================================================================
// REGISTRATION - Tell load balancer we exist
// ====================================================================================

// This function is called ONCE when worker starts up
// It sends a POST request to load balancer saying "Hey, I'm here!"
async fn register_with_load_balancer(node_id: &str, address: &str) -> bool {
    let client = reqwest::Client::new();
    
    // Create node info to send
    let node = WorkerNode {
        id: node_id.to_string(),
        address: address.to_string(),
        active_requests: 0,
        total_requests: 0,
        is_healthy: true,
        last_heartbeat: SystemTime::now(),
    };

    // Send POST request to load balancer's /register endpoint
    match client
        .post("http://127.0.0.1:8080/register")
        .json(&node)  // Convert struct to JSON automatically
        .timeout(Duration::from_secs(3))  // Give up after 3 seconds
        .send()
        .await
    {
        Ok(response) => response.status().is_success(),
        Err(_) => false,
    }
}

// ====================================================================================
// DEREGISTRATION - Tell load balancer we're leaving
// ====================================================================================

// This is called when worker shuts down (Ctrl+C)
// It tells load balancer "Remove me, don't send me any more work"
async fn deregister_with_load_balancer(node_id: &str) {
    let client = reqwest::Client::new();
    
    // Send POST to /deregister endpoint
    let result = client
        .post("http://127.0.0.1:8080/deregister")
        .json(&node_id.to_string())
        .timeout(Duration::from_secs(2))
        .send()
        .await;

    match result {
        Ok(_) => println!("✅ Successfully deregistered from load balancer"),
        Err(e) => eprintln!("⚠️  Failed to deregister: {}", e),
    }
}

// ====================================================================================
// WORK HANDLER - Do the actual work!
// ====================================================================================

// This function is called every time load balancer sends us work
// It receives a WorkRequest and returns a result
async fn handle_work(Json(request): Json<WorkRequest>) -> Json<String> {
    println!("📦 Processing request: {}", request.data);
    
    // SIMULATE WORK: In real app, this would be actual computation
    // We sleep for 500ms to simulate processing time
    time::sleep(Duration::from_millis(500)).await;
    
    // Transform the input (convert to uppercase as example)
    let result = format!("✅ Processed: {}", request.data.to_uppercase());
    
    println!("   → {}", result);
    
    // Return result as JSON
    Json(result)
}

// ====================================================================================
// HEARTBEAT - Tell load balancer we're alive
// ====================================================================================

// This runs FOREVER in background
// Every 5 seconds it sends "I'm alive!" message
// If load balancer doesn't receive heartbeat for 10 seconds, it marks us unhealthy
async fn send_heartbeat_loop(node_id: String) {
    let client = reqwest::Client::new();
    
    loop {
        // Sleep for 5 seconds (non-blocking)
        time::sleep(Duration::from_secs(5)).await;
        
        // Send POST to /heartbeat endpoint
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