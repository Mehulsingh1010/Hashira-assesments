use crate::raft_state::{RaftState, SharedState, PeerInfo, current_ms};
use crate::rpc_handlers::{request_vote_handler, append_entries_handler, client_set_handler, client_get_handler, status_handler};
use crate::background_tasks::{election_loop, apply_committed_loop, leader_heartbeat_loop};
use axum::{
    extract::{Path, State},
    http::StatusCode,
    routing::{get, post},
    Json, Router,
};
use clap::Parser;
use dotenvy::dotenv;
use std::{net::SocketAddr, sync::Arc};
use tokio::task;
use tokio::sync::Mutex;
use tracing::info;

mod raft_state;
mod rpc_handlers;
mod background_tasks;

#[derive(Parser, Debug)]
struct Args {
    #[arg(long)]
    id: usize,

    #[arg(long)]
    port: u16,

    #[arg(long, default_value_t = String::new())]
    peers: String,
}

#[tokio::main]
async fn main() {
    tracing_subscriber::fmt::init();

    dotenv().ok();

    let args = Args::parse();
    let peers: Vec<PeerInfo> = if args.peers.trim().is_empty() {
        vec![]
    } else {
        args.peers
            .split(',')
            .filter_map(|s| {
                let parts: Vec<&str> = s.split(':').collect();
                if parts.len() == 3 {
                    Some(PeerInfo {
                        id: parts[0].parse().ok()?,
                        addr: format!("{}:{}", parts[1], parts[2]),
                    })
                } else {
                    None
                }
            })
            .collect()
    };

    let raft_state = RaftState::new(args.id, peers.clone()).await;
    let state = Arc::new(Mutex::new(raft_state));

    {
        let s = state.clone();
        task::spawn(async move {
            election_loop(s).await;
        });
    }
    {
        let s = state.clone();
        task::spawn(async move {
            apply_committed_loop(s).await;
        });
    }
    {
        let s = state.clone();
        task::spawn(async move {
            leader_heartbeat_loop(s).await;
        });
    }

    let app_state = state.clone();
    let app = Router::new()
        .route("/raft/request_vote", post(request_vote_handler))
        .route("/raft/append_entries", post(append_entries_handler))
        .route("/client/set", post(client_set_handler))
        .route("/client/get/{key}", get(client_get_handler))
        .route("/status", get(status_handler))
        .with_state(app_state);

    let addr = SocketAddr::from(([0, 0, 0, 0], args.port));
    info!("Node {} listening on {}", args.id, addr);
    
    let listener = tokio::net::TcpListener::bind(&addr).await.unwrap();
    axum::serve(listener, app).await.unwrap();
}