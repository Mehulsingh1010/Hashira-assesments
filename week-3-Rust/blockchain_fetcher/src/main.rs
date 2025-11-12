mod api;
mod models;
mod handlers;

use axum::{routing::get, Router};
use dotenv::dotenv;
use tower_http::cors::CorsLayer;

#[tokio::main]
async fn main() {
    dotenv().ok();

    let cors = CorsLayer::permissive();

    let app = Router::new()
        .route("/transactions/summary/:address", get(handlers::get_wallet_report))
        .route("/transactions/history/:address", get(handlers::get_transaction_history))
        .layer(cors); 

    println!("Server started running on http://localhost:3000");

    axum::serve(
        tokio::net::TcpListener::bind("localhost:3000")
            .await
            .expect("Port not able to attach"),
        app,
    )
    .await
    .unwrap();
}



