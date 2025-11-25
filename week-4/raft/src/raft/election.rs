// src/raft/election.rs
use crate::{node::{RaftNode, Role}, state::AppState};
use rand::Rng;
use reqwest::Client;
use tokio::time::{sleep, Duration, Instant};

pub async fn start_election_timer(state: AppState) {
    loop {
        let timeout = rand::thread_rng().gen_range(350..750);
        sleep(Duration::from_millis(timeout)).await;

        let should_start = {
            let node = state.node.lock().unwrap();
            node.role != Role::Leader &&
            node.last_heartbeat.elapsed() > Duration::from_millis(timeout)
        };

        if should_start {
            println!("Node {} election timeout → starting election", {
                let node = state.node.lock().unwrap();
                node.id
            });
            start_election(&state).await;
        }
    }
}

async fn start_election(state: &AppState) {
    let (term, candidate_id) = {
        let mut node = state.node.lock().unwrap();
        node.current_term += 1;
        node.voted_for = Some(node.id);
        node.role = Role::Candidate;
        println!("Node {} → CANDIDATE (term {})", node.id, node.current_term);
        (node.current_term, node.id)
    };

    let client = Client::new();
    let mut votes = 1; // self vote

    for &peer_id in &state.peers {
        let client = client.clone();
        let state = state.clone();
        let term = term;
        let candidate_id = candidate_id;

        tokio::spawn(async move {
            let url = format!("http://127.0.0.1:{}/vote", 3000 + peer_id);
            let req = serde_json::json!({
                "term": term,
                "candidate_id": candidate_id
            });

            if let Ok(_) = client.post(&url).json(&req).send().await {
                let mut node = state.node.lock().unwrap();
                if node.current_term == term && node.role == Role::Candidate {
                    votes += 1;
                    println!("Node {} got vote from {} (total: {})", candidate_id, peer_id, votes);
                    if votes >= (state.peers.len() + 1) / 2 + 1 {
                        node.role = Role::Leader;
                        println!("LEADER ELECTED → Node {} (term {})", node.id, term);
                    }
                }
            }
        });
    }
}