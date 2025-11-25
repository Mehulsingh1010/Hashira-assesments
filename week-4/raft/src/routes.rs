// src/routes.rs
use axum::{
    extract::{Path, State},
    Json,
    response::IntoResponse,
    http::StatusCode,
};
use serde::{Deserialize, Serialize};
use crate::state::AppState;

#[derive(Serialize)]
pub struct HealthResponse {
    id: u64,
    role: String,
    term: u64,
    status: String,
}

pub async fn health(State(state): State<AppState>) -> Json<HealthResponse> {
    let node = state.node.lock().unwrap();
    Json(HealthResponse {
        id: node.id,
        role: format!("{:?}", node.role),
        term: node.current_term,
        status: "alive".to_string(),
    })
}

#[derive(Deserialize)]
pub struct Item {
    key: String,
    value: String,
}

pub async fn set_item(State(state): State<AppState>, Json(item): Json<Item>) -> impl IntoResponse {
    let mut node = state.node.lock().unwrap();
    // For now, just insert - later restrict to leader
    let mut db = node.db.lock().unwrap();
    db.execute(
        "INSERT OR REPLACE INTO kv (key, value) VALUES (?1, ?2)",
        [&item.key, &item.value],
    ).unwrap();
    (StatusCode::OK, Json(serde_json::json!({ "success": true })))
}
pub async fn get_item(State(state): State<AppState>, Path(key): Path<String>) -> impl IntoResponse {
    let node = state.node.lock().unwrap();
    let db = node.db.lock().unwrap();
    let mut stmt = db.prepare("SELECT value FROM kv WHERE key = ?1").unwrap();
    match stmt.query_row([&key], |row| row.get::<_, String>(0)) {
        Ok(value) => (StatusCode::OK, Json(serde_json::json!({ "value": value }))),
        Err(_) => (StatusCode::NOT_FOUND, Json(serde_json::json!({ "error": "not found" }))),
    }
}