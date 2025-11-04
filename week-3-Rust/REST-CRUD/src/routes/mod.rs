use axum::{Router, routing::{get, post}};
use crate::handlers::user_handler::{get_user, create_user};

pub fn create_router() -> Router {
    Router::new()
        .route("/get_user", get(get_user))
        .route("/create_user", post(create_user))
}
