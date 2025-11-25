// src/main.rs
use axum::{Router, routing::{get, post}};
use std::net::SocketAddr;
use tower_http::cors::CorsLayer;
mod state;
mod node;
mod routes;

use state::AppState;

#[tokio::main]
async fn main() {
    let args: Vec<String> = std::env::args().collect();
    let id: u64 = args.get(1).and_then(|s| s.parse().ok()).unwrap_or(1);
    let port = 3000 + id;

    let all_peers = vec![1, 2, 3, 4, 5];
    let peers = all_peers.into_iter().filter(|&p| p != id).collect();
    let state = AppState::new(id, peers);

    let app = Router::new()
        .route("/health", get(routes::health))
        .route("/items", post(routes::set_item))
        .route("/items/:key", get(routes::get_item))
        .layer(CorsLayer::permissive())
        .with_state(state);

    let addr = SocketAddr::from(([0, 0, 0, 0], port as u16));
    println!("Node {id} started on http://127.0.0.1:{port}");
    let listener = tokio::net::TcpListener::bind(&addr).await.unwrap();
    axum::serve(listener, app).await.unwrap();
}