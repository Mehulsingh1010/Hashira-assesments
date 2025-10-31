use axum::debug_handler;
use axum::{Json};

#[derive(Debug,serde::Serialize)]
pub struct Vehicle{
    manufacturer: String,
    model: String,
    year:u32,
    id:String
}


#[debug_handler]
pub async fn vehicle_get() -> Json<Vehicle>{
    println!("Caller retrieved a vechile from axum server");
    Json::from(
    Vehicle{
        manufacturer: "Toyota".to_string(),
        model: "Corolla".to_string(),
        year: 2020,
        id: uuid::Uuid::new_v4().to_string()
    })
}


pub async fn vehicle_post() {

}