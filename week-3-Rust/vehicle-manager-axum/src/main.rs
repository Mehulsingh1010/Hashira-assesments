use axum::{Router, routing::get};

mod vehicle;

use vehicle::{vehicle_get, vehicle_post};

#[tokio::main]

async fn main() {
    let app = Router::new()
    .route("/vehicle", get(vehicle_get).post(vehicle_post));
   

    let listener = tokio::net::TcpListener::bind("0.0.0.0:3000").await.unwrap();
    axum::serve(listener, app).await.unwrap();
}
