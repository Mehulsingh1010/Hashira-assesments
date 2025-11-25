use std::time::{Duration, Instant};
use tokio::time::interval;
use crate::state::AppState;
use crate::node::Role;
use crate::messages::RequestVoteRequest;

const ELECTION_TIMEOUT_MS: u64 = 1500;
const HEARTBEAT_INTERVAL_MS: u64 = 500;

pub async fn run_election_loop(state: AppState) {
    let mut ticker = interval(Duration::from_millis(100));

    loop {
        ticker.tick().await;

        let mut node = state.node.lock().unwrap();
        let elapsed = node.last_heartbeat.elapsed().as_millis() as u64;
        let total_peers = state.peers.len() + 1;
        let majority = (total_peers / 2) + 1;

        match node.role {
            Role::Follower => {
                if elapsed > ELECTION_TIMEOUT_MS {
                    println!("\n[ELECTION] Node {} timeout - starting election for term {}", node.id, node.current_term + 1);
                    node.start_election(total_peers);
                }
            }

            Role::Candidate => {
                if node.check_election_won(total_peers) {
                    println!("║ LEADER ELECTED: NODE {} (TERM {}) ║", node.id, node.current_term);
                    println!("║ Votes: {}/{} ║", node.votes_received, majority);
                    node.role = Role::Leader;
                    node.last_heartbeat = std::time::Instant::now().into();
                } else if elapsed > ELECTION_TIMEOUT_MS {
                    println!("[ELECTION] Node {} restarting election (votes: {}/{}, timeout)", 
                        node.id, 
                        node.votes_received, 
                        majority
                    );
                    node.start_election(total_peers);
                }
            }

            Role::Leader => {
                if elapsed > HEARTBEAT_INTERVAL_MS {
                    node.last_heartbeat = std::time::Instant::now().into();
                }
            }
        }
    }
}

pub async fn broadcast_request_votes(state: AppState) {
    loop {
        tokio::time::sleep(Duration::from_millis(50)).await;

        let node = state.node.lock().unwrap();
        if node.role != Role::Candidate {
            continue;
        }

        let last_log_index = node.log.len() as u64;
        let last_log_term = node.log.last().map(|e| e.term).unwrap_or(0);
        let term = node.current_term;
        let candidate_id = node.id;

        drop(node);

        for &peer_id in &state.peers {
            let peer_port = 3000 + peer_id;
            let url = format!("http://127.0.0.1:{}/request_vote", peer_port);

            let req = RequestVoteRequest {
                candidate_id,
                term,
                last_log_index,
                last_log_term,
            };

            let state_clone = state.clone();
            
            tokio::spawn(async move {
                match reqwest::Client::new()
                    .post(&url)
                    .json(&req)
                    .send()
                    .await
                {
                    Ok(res) => {
                        if let Ok(response) = res.json::<serde_json::Value>().await {
                            let granted = response.get("granted").and_then(|v| v.as_bool()).unwrap_or(false);
                            println!("[VOTE] Peer {} -> Candidate {} | Granted: {}", peer_id, candidate_id, granted);
                            
                            if granted {
                                let mut node = state_clone.node.lock().unwrap();
                                if node.role == Role::Candidate && node.current_term == term {
                                    node.votes_received += 1;
                                    println!("[VOTE-COUNT] Candidate {} now has {}/{} votes", 
                                        candidate_id, 
                                        node.votes_received,
                                        state_clone.peers.len() + 1
                                    );
                                }
                            }
                        }
                    }
                    Err(e) => {
                        println!("[VOTE] ❌ Peer {} unreachable: {}", peer_id, e);
                    }
                }
            });
        }
    }
}

pub async fn broadcast_heartbeats(state: AppState) {
    use crate::messages::AppendEntriesRequest;

    loop {
        tokio::time::sleep(Duration::from_millis(HEARTBEAT_INTERVAL_MS)).await;

        let mut node = state.node.lock().unwrap();
        if node.role != Role::Leader {
            drop(node);
            continue;
        }

        let term = node.current_term;
        let leader_id = node.id;
        let leader_commit_index = node.commit_index;
        let peers_count = state.peers.len();

        drop(node);

        let mut dead_peers = 0;
        
        for &peer_id in &state.peers {
            let peer_port = 3000 + peer_id;
            let url = format!("http://127.0.0.1:{}/append_entries", peer_port);

            let req = AppendEntriesRequest {
                leader_id,
                term,
                prev_log_index: 0,
                prev_log_term: 0,
                entries: vec![],
                leader_commit_index,
            };

            let state_clone = state.clone();
            tokio::spawn(async move {
                match reqwest::Client::new()
                    .post(&url)
                    .timeout(Duration::from_millis(500))
                    .json(&req)
                    .send()
                    .await
                {
                    Ok(_) => {
                        let mut node = state_clone.node.lock().unwrap();
                        node.peer_health.insert(peer_id, Instant::now().into());
                    }
                    Err(_) => {
                        println!("[HEARTBEAT] ⚠️ Peer {} unreachable", peer_id);
                    }
                }
            });
        }

        let mut node = state.node.lock().unwrap();
        let healthy_peers = node.peer_health.iter()
            .filter(|(_, last_contact)| last_contact.elapsed().as_secs() < 2)
            .count();

        if node.role == Role::Leader && healthy_peers < peers_count / 2 {
            println!("\n[ALERT] Leader lost quorum! ({}/{} peers alive)", healthy_peers, peers_count);
            println!("[ALERT] New election will be triggered\n");
        }
    }
}
