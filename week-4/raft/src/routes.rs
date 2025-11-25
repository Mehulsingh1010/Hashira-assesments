use axum::{
    extract::{Path, State},
    Json,
    response::IntoResponse,
    http::StatusCode,
};
use serde::{Deserialize, Serialize};
use crate::state::AppState;
use crate::messages::{RequestVoteRequest, RequestVoteResponse, AppendEntriesRequest, AppendEntriesResponse};
use crate::node::Role;

pub async fn health(
    State(state): State<AppState>,
) -> impl IntoResponse {
    let node = state.node.lock().unwrap();
    
    (
        StatusCode::OK,
        Json(serde_json::json!({
            "id": node.id,
            "role": format!("{:?}", node.role),
            "term": node.current_term,
            "status": "alive",
            "is_leader": node.role == Role::Leader,
            "votes_received": node.votes_received,
            "timestamp": chrono::Local::now().to_rfc3339(),
        })),
    )
}

#[derive(Deserialize)]
pub struct SetItemRequest {
    pub key: String,
    pub value: String,
}

pub async fn set_item(
    State(state): State<AppState>,
    Json(req): Json<SetItemRequest>,
) -> impl IntoResponse {
    let node = state.node.lock().unwrap();
    let db = node.db.lock().unwrap();

    match db.execute(
        "INSERT OR REPLACE INTO kv (key, value) VALUES (?, ?)",
        [&req.key, &req.value],
    ) {
        Ok(_) => (
            StatusCode::OK,
            Json(serde_json::json!({ "ok": true, "key": req.key })),
        ),
        Err(e) => (
            StatusCode::INTERNAL_SERVER_ERROR,
            Json(serde_json::json!({ "error": e.to_string() })),
        ),
    }
}

pub async fn get_item(
    State(state): State<AppState>,
    Path(key): Path<String>,
) -> impl IntoResponse {
    let node = state.node.lock().unwrap();
    let db = node.db.lock().unwrap();

    let mut stmt = match db.prepare("SELECT value FROM kv WHERE key = ?") {
        Ok(s) => s,
        Err(_) => {
            return (
                StatusCode::INTERNAL_SERVER_ERROR,
                Json(serde_json::json!({ "error": "db error" })),
            )
        }
    };

    let value = stmt.query_row([&key], |row| row.get::<_, String>(0));

    match value {
        Ok(v) => (
            StatusCode::OK,
            Json(serde_json::json!({ "key": key, "value": v })),
        ),
        Err(_) => (
            StatusCode::NOT_FOUND,
            Json(serde_json::json!({ "error": "key not found" })),
        ),
    }
}

pub async fn request_vote(
    State(state): State<AppState>,
    Json(req): Json<RequestVoteRequest>,
) -> impl IntoResponse {
    let mut node = state.node.lock().unwrap();
    
    let granted = node.handle_request_vote(
        req.candidate_id,
        req.term,
        req.last_log_index,
        req.last_log_term,
    );

    (
        StatusCode::OK,
        Json(serde_json::json!({
            "from": node.id,
            "term": node.current_term,
            "granted": granted,
            "role": format!("{:?}", node.role),
            "is_leader": node.role == Role::Leader,
        })),
    )
}

pub async fn append_entries(
    State(state): State<AppState>,
    Json(req): Json<AppendEntriesRequest>,
) -> impl IntoResponse {
    let mut node = state.node.lock().unwrap();
    
    let success = node.handle_append_entries(
        req.leader_id,
        req.term,
        req.prev_log_index,
        req.prev_log_term,
        req.entries,
        req.leader_commit_index,
    );

    (
        StatusCode::OK,
        Json(serde_json::json!({
            "from": node.id,
            "term": node.current_term,
            "success": success,
            "role": format!("{:?}", node.role),
        })),
    )
}

#[derive(Deserialize)]
pub struct VoteResponse {
    pub granted: bool,
    pub term: u64,
}

pub async fn handle_vote_response(
    State(state): State<AppState>,
    Json(response): Json<VoteResponse>,
) -> impl IntoResponse {
    let mut node = state.node.lock().unwrap();

    // If response contains higher term, revert to follower
    if response.term > node.current_term {
        node.current_term = response.term;
        node.role = crate::node::Role::Follower;
        node.voted_for = None;
    }

    // If vote granted and we're still a candidate, increment counter
    if response.granted && node.role == crate::node::Role::Candidate {
        node.votes_received += 1;
    }

    (StatusCode::OK, Json(serde_json::json!({ "ok": true })))
}

pub async fn status(
    State(state): State<AppState>,
) -> impl IntoResponse {
    let node = state.node.lock().unwrap();
    
    (
        StatusCode::OK,
        Json(serde_json::json!({
            "node_id": node.id,
            "role": format!("{:?}", node.role),
            "is_leader": node.role == Role::Leader,
            "current_term": node.current_term,
            "voted_for": node.voted_for,
            "votes_received": node.votes_received,
            "log_length": node.log.len(),
            "commit_index": node.commit_index,
        })),
    )
}
