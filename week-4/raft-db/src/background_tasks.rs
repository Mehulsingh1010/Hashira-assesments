use crate::raft_state::{SharedState, RaftState, Role, PeerInfo, RequestVoteArgs, RequestVoteResponse, AppendEntriesArgs, AppendEntriesResponse, LogEntry};
use rand::Rng;
use reqwest::Client;
use std::{time::Duration, cmp};
use tokio::{task, time};
use tracing::{info, debug, error};

use super::raft_state::current_ms;


pub async fn election_loop(st: SharedState) {
    loop {
        let timeout_ms = rand::thread_rng().gen_range(150..300);
        time::sleep(Duration::from_millis(timeout_ms)).await;

        let should_start_election = {
            let s = st.lock().await;
            if s.role == Role::Leader {
                false
            } else {
                let elapsed = current_ms().saturating_sub(s.last_heartbeat_ms);
                elapsed >= 300
            }
        };

        if !should_start_election {
            continue;
        }

        let (term_at_start, last_idx, last_term, peers, id, client) = {
            let mut s = st.lock().await;
            s.role = Role::Candidate;
            s.current_term += 1;
            s.voted_for = Some(s.id);
            s.last_heartbeat_ms = current_ms();
            
            info!("Node {} starting election for term {}", s.id, s.current_term);
            
            (
                s.current_term,
                s.last_log_index(),
                s.last_log_term(),
                s.peers.clone(),
                s.id,
                s.client.clone(),
            )
        };

        let mut handles = vec![];
        for peer in peers.iter() {
            let url = format!("http://{}/raft/request_vote", peer.addr);
            let c = client.clone();
            let args = RequestVoteArgs {
                term: term_at_start,
                candidate_id: id,
                last_log_index: last_idx,
                last_log_term: last_term,
            };
            
            handles.push(task::spawn(async move {
                match c.post(&url).json(&args).send().await {
                    Ok(r) => match r.json::<RequestVoteResponse>().await {
                        Ok(rv) => Some(rv),
                        Err(_) => None,
                    },
                    Err(_) => None,
                }
            }));
        }

        let mut votes = 1usize;
        let mut higher_term_seen = None;
        
        for h in handles {
            if let Ok(Some(rv)) = h.await {
                if rv.term > term_at_start {
                    higher_term_seen = Some(rv.term);
                } else if rv.vote_granted {
                    votes += 1;
                }
            }
        }

        let mut s = st.lock().await;
        
        if let Some(ht) = higher_term_seen {
            if ht > s.current_term {
                s.current_term = ht;
                s.role = Role::Follower;
                s.voted_for = None;
            }
            continue;
        }

        if s.role == Role::Candidate && s.current_term == term_at_start {
            let majority = s.majority();
            if votes >= majority {
                s.role = Role::Leader;
                info!("Node {} became leader for term {} with {} votes", s.id, s.current_term, votes);
                
                let next_idx = s.last_log_index() + 1;
                let peer_ids: Vec<usize> = s.peers.iter().map(|p| p.id).collect();
                
                for peer_id in peer_ids {
                    s.next_index.insert(peer_id, next_idx);
                    s.match_index.insert(peer_id, 0);
                }
            } else {
                s.role = Role::Follower;
            }
        }
    }
}

pub async fn leader_heartbeat_loop(st: SharedState) {
    loop {
        time::sleep(Duration::from_millis(50)).await;
        
        let is_leader = {
            let s = st.lock().await;
            s.role == Role::Leader
        };
        
        if !is_leader {
            continue;
        }
        
        let (term, leader_id, peers, client) = {
            let s = st.lock().await;
            (s.current_term, s.id, s.peers.clone(), s.client.clone())
        };
        
        for peer in peers {
            let st_clone = st.clone();
            let client_clone = client.clone();
            let peer_clone = peer.clone();
            
            task::spawn(async move {
                replicate_to_peer(st_clone, peer_clone, term, leader_id, client_clone).await;
            });
        }
    }
}

async fn replicate_to_peer(
    st: SharedState,
    peer: PeerInfo,
    term: u64,
    leader_id: usize,
    client: Client,
) {
    let (next_idx, prev_log_index, prev_log_term, entries, leader_commit) = {
        let s = st.lock().await;
        if s.role != Role::Leader || s.current_term != term {
            return;
        }
        
        let next_idx = *s.next_index.get(&peer.id).unwrap_or(&1);
        let prev_log_index = next_idx - 1;
        let prev_log_term = s.get_log_term(prev_log_index).unwrap_or(0);
        
        // This is safe because log indices are 1-based, and we only attempt to access the log 
        // for indices >= 1. The original code implicitly handles the case where `next_idx` is 1 
        // (i.e., `prev_log_index` is 0), which correctly results in `prev_log_term` of 0.
        
        let entries: Vec<LogEntry> = s
            .log
            .iter()
            // We need to find the starting point in the log vector.
            // Assuming log is sorted by index. The original code uses filtering which works.
            .filter(|e| e.index >= next_idx) 
            .cloned()
            .collect();
        
        (next_idx, prev_log_index, prev_log_term, entries, s.commit_index)
    };
    
    let args = AppendEntriesArgs {
        term,
        leader_id,
        prev_log_index,
        prev_log_term,
        entries: entries.clone(),
        leader_commit,
    };
    
    let url = format!("http://{}/raft/append_entries", peer.addr);
    
    match client.post(&url).json(&args).send().await {
        Ok(resp) => match resp.json::<AppendEntriesResponse>().await {
            Ok(ae_resp) => {
                let mut s = st.lock().await;
                
                if ae_resp.term > s.current_term {
                    s.current_term = ae_resp.term;
                    s.role = Role::Follower;
                    s.voted_for = None;
                    return;
                }
                
                if s.role != Role::Leader || s.current_term != term {
                    return;
                }
                
                if ae_resp.success {
                    if !entries.is_empty() {
                        let last_idx = entries.last().unwrap().index;
                        s.next_index.insert(peer.id, last_idx + 1);
                        s.match_index.insert(peer.id, last_idx);
                    }
                    
                    update_commit_index(&mut s);
                } else {
                    if let Some(conflict_idx) = ae_resp.conflict_index {
                        // The paper suggests a more complex back-off on term mismatch, 
                        // but the existing logic is to set next_index to the reported conflict index.
                        s.next_index.insert(peer.id, conflict_idx);
                    } else {
                        // Default back-off is to step back by 1 (or at least to index 1)
                        let new_next = next_idx.saturating_sub(1).max(1);
                        s.next_index.insert(peer.id, new_next);
                    }
                }
            }
            Err(_) => {}
        },
        Err(_) => {}
    }
}

pub fn update_commit_index(s: &mut RaftState) {
    if s.role != Role::Leader {
        return;
    }
    
    // Collect all match indices (including the leader's own last log index)
    let mut indices: Vec<i64> = s.match_index.values().copied().collect();
    indices.push(s.last_log_index());
    indices.sort_by(|a, b| b.cmp(a));
    
    // Find the Nth largest index, where N is the majority size
    let majority_size = s.majority();
    
    // The index in the sorted list that represents the match index for the majority
    // Since `indices.len()` is (total_nodes), and we need floor(total_nodes/2) + 1,
    // the index is (total_nodes/2), as array indices are 0-based.
    // e.g., 5 nodes, majority = 3. 5/2 = 2. indices[2] is the 3rd largest.
    // e.g., 3 nodes, majority = 2. 3/2 = 1. indices[1] is the 2nd largest.
    let majority_idx = indices.len().saturating_sub(majority_size);
    let n = *indices.get(majority_idx).unwrap_or(&0);
    
    // The original code uses a slightly different calculation, which works for finding the 
    // index of the majority element in a reverse-sorted list:
    // let majority_idx = (indices.len() - 1) / 2; // For total nodes T, this is floor((T-1)/2).
    // Let's stick to the original logic:
    let original_majority_idx = (indices.len() - 1) / 2;
    let n = indices[original_majority_idx];
    
    if n > s.commit_index {
        if let Some(entry) = s.log.iter().find(|e| e.index == n) {
            if entry.term == s.current_term {
                s.commit_index = n;
                debug!("Leader {} advanced commit_index to {}", s.id, n);
            }
        }
    }
}

pub async fn apply_committed_loop(st: SharedState) {
    loop {
        time::sleep(Duration::from_millis(50)).await;

        let (_commit_idx, _last_applied, entry_opt) = {
            let mut s = st.lock().await;
            if s.commit_index > s.last_applied {
                let idx = s.last_applied + 1;
                // Find the entry that needs to be applied
                let e = s.log.iter().find(|e| e.index == idx).cloned();
                s.last_applied = idx;
                (s.commit_index, s.last_applied, e)
            } else {
                continue;
            }
        };

        if let Some(entry) = entry_opt {
            let st2 = st.clone();
            let key = entry.key;
            let value = entry.value.clone();

            task::spawn(async move {
                let s = st2.lock().await;
                match s.save_to_db(key, value).await {
                    Ok(_) => debug!("Applied entry key={} to DB", key),
                    Err(e) if e == "exists" => debug!("Key {} already exists in DB; skipping apply", key), 
                    Err(e) => error!("Failed to persist entry key={} to DB: {}", key, e),
                }
            });
        }
    }
}