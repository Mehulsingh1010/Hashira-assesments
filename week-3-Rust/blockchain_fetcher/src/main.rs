mod api;
mod models;
mod handlers;

use axum::{routing::get, Router};
use dotenv::dotenv;

#[tokio::main]
async fn main() {
    dotenv().ok();

    let app = Router::new()
        .route("/transactions/:address", get(handlers::get_wallet_report))
        .route("/transactions/history/:address", get(handlers::get_transaction_history));

    println!("Server started running on http://localhost:3000");

    axum::serve(
        tokio::net::TcpListener::bind("localhost:3000")
            .await
            .expect("Can't bind to port"),
        app,
    )
    .await
    .unwrap();
}
