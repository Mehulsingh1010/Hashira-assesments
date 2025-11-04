use axum::{Json, extract::Path};
use crate::models::user::User;

pub async fn get_user() -> Json<User> {
    let user = User {
        name: "Messi".to_string(),
        age: 27,
        active: true,
    };

    Json(user)
}

pub async fn create_user(Json(user): Json<User>) -> Json<User> {
    println!("📩 Received user: {:?}", user);
    Json(user)
}
