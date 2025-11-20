use axum::{
    Router, extract::State, http::{StatusCode, response}, response::Json, routing::{get,post}//router to post request routes
};

use serde::{Deserialize,Serialize};
use std::{
    collections::HashMap, hash::Hash, sync::Arc, time::{Duration,SystemTime}
};

use tokio::sync::RwLock;
use tower_http::cors::CorsLayer;
use uuid::Uuid;

#[derive(Clone,Serialize,Deserialize,Debug)]
struct WorkerNode{
    id:String,
    address:String,
    active_requests:usize,
    total_requests:usize,
    is_healthy:bool,
    last_heartbeat:SystemTime
}

#[derive(Clone,Serialize)]
struct LoadBalanceStats{
    nodes:Vec<WorkerNode>,
    total_requests:usize,
    active_nodes:usize
}


#[derive(Serialize,Deserialize)]
struct IncomingRequest{
    data:String
}

#[derive(Serialize)]
struct RequestResponse{
    request_id:String,
    node_id:String,
    result:String
}

type SharedState = Arc<RwLock<AppState>>;

struct AppState{
    nodes:HashMap<String,WorkerNode>,
    total_request:usize,
    round_robin_index:usize

}

impl AppState{
    fn new()->Self{
        Self{
        nodes:HashMap::new(),
        total_request: 0,
        round_robin_index:0,
        }
    }
    fn select_node(&mut self)-> Option<String>{
        let active_nodes: Vec<_> = self.nodes.values().filter(|n| n.is_healthy).collect();

        if active_nodes.is_empty(){
            return None;
        }

        self.round_robin_index=(self.round_robin_index + 1) % active_nodes.len();
        Some(active_nodes[self.round_robin_index].id.clone())
    }

}

#[tokio::main]
async fn main(){
    // tracing_subscriber::fmt::init();

    // let state: SharedState =Arc::new(RwLock::new(AppState::new() ));
    // let state_clone=state.clone();
    // tokio::spawn(async move{
    //     health_check_loop(state_clone).await;
    // });

    // let app=Router::new().route("/process",post(handle_request));

    let listener = tokio::net::TcpListener::bind("127.0.0.1:8080").await.unwrap();

    println!("Load balancer up and running at http://127.0.1:8080");
    println!("stats : http://127.0.0.1:8080");

    axum::serve(listener,app).await.unwrap();
}

async fn handle_request(
    State(state): State<SharedState>,
    Json(payload): Json<IncomingRequest>,
) -> Result<Json<RequestResponse>, StatusCode> {
    let request_id = Uuid::new_v4().to_string();

    let mut state_guard: tokio::sync::RwLockWriteGuard<'_, AppState> = state.write().await;
    state_guard.total_request += 1;

    let node_id = match state_guard.select_node() {
        Some(id) => id,
        None => return Err(StatusCode::SERVICE_UNAVAILABLE),
    };

    if let Some(node) = state_guard.nodes.get_mut(&node_id) {
        node.active_requests += 1;
        node.total_requests += 1;
    }

    let node_address = state_guard.nodes.get(&node_id).unwrap().address.clone();

    drop(state_guard); // release lock before network

    let client = reqwest::Client::new();

    let response = client
        .post(format!("{}/work", node_address))
        .json(&payload)
        .timeout(Duration::from_secs(5))   // <-- fixed
        .send()
        .await;

     let mut state_guard: tokio::sync::RwLockWriteGuard<'_, AppState> = state.write().await;
    if let Some(node) = state_guard.nodes.get_mut(&node_id) {
        node.active_requests = node.active_requests.saturating_sub(1);
    }

    // Return result
    match response {
        Ok(res) => {
            let result = res.text().await.unwrap_or_else(|_| "Error".to_string());
            Ok(Json(RequestResponse {
                request_id,
                node_id,
                result,
            }))
        }
        Err(_) => Err(StatusCode::INTERNAL_SERVER_ERROR),
    }
   
}

async fn register_load(node_id:&str, address:&str)-> bool{
    let  client = reqwest::Client::new();

    let node =WorkerNode{
        id:node_id.to_string()
    }
}
