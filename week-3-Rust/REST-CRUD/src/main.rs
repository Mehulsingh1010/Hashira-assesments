use axum::{Router, routing::{get, post}};
use std::net::SocketAddr;
use tokio::net::TcpListener;

mod routes;
mod models;
mod handlers;
mod utils;

#[tokio::main]
async fn main() {
    // Define the router
    let app = routes::create_router();

    // Define address and bind listener
    let addr = SocketAddr::from(([127, 0, 0, 1], 3000));
    let listener = TcpListener::bind(addr).await.unwrap();

    println!("🚀 Server running at http://{}", addr);

    // Serve using Axum 0.7 style
    axum::serve(listener, app)
        .await
        .unwrap();
}
