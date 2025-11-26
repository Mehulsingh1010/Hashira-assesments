use axum::{
    routing::{get, post},
    Router,
};
use clap::Parser;
use std::net::SocketAddr;
use tokio::task;
use tracing::info;
use tracing_subscriber;

mod config;
mod state;
mod handlers;
mod loops;
mod rpc;

use config::Args;
use state::{RaftState, SharedState};

#[tokio::main]
async fn main() {
    tracing_subscriber::fmt::init();

    let args = Args::parse();
    let peers = config::parse_peers(&args.peers);
    
    // Create the shared state for the Raft node
    let state = RaftState::new(args.id, peers);
    let shared_state: SharedState = std::sync::Arc::new(tokio::sync::Mutex::new(state));

    info!("Node {} starting with {} peers.", args.id, shared_state.lock().await.peers.len());

    // Spawn background tasks
    task::spawn(loops::election_loop(shared_state.clone()));
    task::spawn(loops::apply_committed_loop(shared_state.clone()));
    task::spawn(loops::leader_heartbeat_loop(shared_state.clone()));

    let app = Router::new()
        .route("/raft/request_vote", post(handlers::request_vote_handler))
        .route("/raft/append_entries", post(handlers::append_entries_handler))
        .route("/client/set", post(handlers::client_set_handler))
        .route("/client/get/{key}", get(handlers::client_get_handler))
        // Status/Debug
        .route("/status", get(handlers::status_handler))
        .with_state(shared_state.clone());

    let addr = SocketAddr::from(([0, 0, 0, 0], args.port));
    info!("Node {} listening on {}", args.id, addr);

    let listener = tokio::net::TcpListener::bind(&addr).await.unwrap();
    axum::serve(listener, app).await.unwrap();
}