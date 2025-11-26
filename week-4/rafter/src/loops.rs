use crate::config::{AppendEntriesArgs, PeerInfo, RequestVoteArgs};
use crate::rpc::{send_append_entries, send_request_vote};
use crate::state::{current_ms, SharedState, RaftState, Role};
use rand::Rng;
use reqwest::Client;
use std::time::Duration;
use tokio::{task, time};
use tracing::{debug, info};

// eelection timeout: 150-300ms
const MIN_ELECTION_TIMEOUT_MS: u64 = 150;
const MAX_ELECTION_TIMEOUT_MS: u64 = 300;
// leader heartbeat interval: 50ms (needs to be < MIN_ELECTION_TIMEOUT_MS)
const HEARTBEAT_INTERVAL_MS: u64 = 50;

// ---------------- Background Loops ----------------

pub async fn election_loop(st: SharedState) {
    loop {
        let timeout_ms = rand::thread_rng().gen_range(MIN_ELECTION_TIMEOUT_MS..MAX_ELECTION_TIMEOUT_MS);
        time::sleep(Duration::from_millis(timeout_ms)).await;

        let should_start_election = {
            let s = st.lock().await;
            if s.role == Role::Leader {
                false
            } else {
                let elapsed = current_ms().saturating_sub(s.last_heartbeat_ms);
                // using MAX_ELECTION_... as the full threshold for simplicity
                elapsed >= MAX_ELECTION_TIMEOUT_MS.into() 
            }
        };

        if !should_start_election {
            continue;
        }

        // Start election
        let (term_at_start, last_idx, last_term, peers, id, client) = {
            let mut s = st.lock().await;
            s.role = Role::Candidate;
            s.current_term += 1;
            s.voted_for = Some(s.id);
            s.last_heartbeat_ms = current_ms(); // Reset timer at start of election

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
            let client_clone = client.clone();
            let args = RequestVoteArgs {
                term: term_at_start,
                candidate_id: id,
                last_log_index: last_idx,
                last_log_term: last_term,
            };

            handles.push(task::spawn(
                send_request_vote(client_clone, peer.clone(), args)
            ));
        }

        let mut votes = 1usize; // Self vote
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

        // Update state based on results
        let mut s = st.lock().await;

        // Handle higher term seen during election
        if let Some(ht) = higher_term_seen {
            if ht > s.current_term {
                info!(
                    "Node {} found higher term ({}) during election, stepping down to Follower",
                    s.id, ht
                );
                s.current_term = ht;
                s.role = Role::Follower;
                s.voted_for = None;
            }
            continue;
        }

        // Check if we won the election
        if s.role == Role::Candidate && s.current_term == term_at_start {
            let majority = s.majority();
            if votes >= majority {
                // Check if already leader, which can happen if multiple elections overlap
                if s.role != Role::Leader {
                    s.role = Role::Leader;
                    info!("Node {} became LEADER for term {} with {} votes", s.id, s.current_term, votes);
                    
                    // Initialize leader state
                    let next_idx = s.last_log_index() + 1;
                    s.next_index.clear();
                    s.match_index.clear();
                    
                    let peer_ids: Vec<usize> = s.peers.iter().map(|p| p.id).collect();
                    
                    for peer_id in peer_ids {
                        s.next_index.insert(peer_id, next_idx);
                        s.match_index.insert(peer_id, 0);
                        // Log that the leader is now aware of the new commitment for this peer
                        info!("Leader {} initialized next_index[{}] = {}", s.id, peer_id, next_idx);
                    }
                }
            } else {
                info!(
                    "Node {} lost election in term {} with {} votes (needs {})",
                    s.id, s.current_term, votes, majority
                );
                s.role = Role::Follower; // Demote after losing
            }
        }
    }
}

pub async fn leader_heartbeat_loop(st: SharedState) {
    loop {
        time::sleep(Duration::from_millis(HEARTBEAT_INTERVAL_MS)).await;

        let is_leader = {
            let s = st.lock().await;
            s.role == Role::Leader
        };

        if !is_leader {
            continue;
        }

        // Send AppendEntries to all peers
        let (term, leader_id, peers, client) = {
            let s = st.lock().await;
            (s.current_term, s.id, s.peers.clone(), s.client.clone())
        };

        for peer in peers {
            let st_clone = st.clone();
            let client_clone = client.clone();

            task::spawn(async move {
                replicate_to_peer(st_clone, peer, term, leader_id, client_clone).await;
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
        // Double check state before preparing RPC
        if s.role != Role::Leader || s.current_term != term {
            return;
        }

        let next_idx = *s.next_index.get(&peer.id).unwrap_or(&1);
        let prev_log_index = next_idx - 1;
        let prev_log_term = s.get_log_term(prev_log_index).unwrap_or(0);

        // Get entries to send (this is the core replication logic)
        let entries: Vec<_> = s
            .log
            .iter()
            .filter(|e| e.index >= next_idx)
            .cloned()
            .collect();

        (
            next_idx,
            prev_log_index,
            prev_log_term,
            entries,
            s.commit_index,
        )
    };

    let args = AppendEntriesArgs {
        term,
        leader_id,
        prev_log_index,
        prev_log_term,
        entries: entries.clone(),
        leader_commit,
    };

    let ae_resp = send_append_entries(client, peer.clone(), args).await;

    if let Some(ae_resp) = ae_resp {
        let mut s = st.lock().await;

        // Check if a higher term was discovered in the response
        if ae_resp.term > s.current_term {
             info!(
                "Node {} discovered higher term ({}) in AE response from {}, stepping down to Follower",
                s.id, ae_resp.term, peer.id
            );
            s.current_term = ae_resp.term;
            s.role = Role::Follower;
            s.voted_for = None;
            return;
        }

        if s.role != Role::Leader || s.current_term != term {
            return; // State changed while awaiting response
        }

        if ae_resp.success {
            // Update next_index and match_index
            if !entries.is_empty() {
                let last_idx = entries.last().unwrap().index;
                s.next_index.insert(peer.id, last_idx + 1);
                s.match_index.insert(peer.id, last_idx);
                debug!(
                    "Leader {} successfully replicated to {}. next_index: {}, match_index: {}",
                    s.id, peer.id, last_idx + 1, last_idx
                );
            }

            // Try to advance commit_index
            update_commit_index(&mut s);
        } else {
            // Decrement next_index and retry
            let new_next = if let Some(conflict_idx) = ae_resp.conflict_index {
                // Use conflict info to jump back more quickly
                conflict_idx
            } else {
                // Fallback: simply decrement by one
                next_idx.saturating_sub(1).max(1)
            };
            s.next_index.insert(peer.id, new_next);
            debug!(
                "Leader {} failed to replicate to {}. Decremented next_index to {}",
                s.id, peer.id, new_next
            );
        }
    }
}

/// Tries to advance the leader's commit index based on replicated logs.
fn update_commit_index(s: &mut RaftState) {
    if s.role != Role::Leader {
        return;
    }

    // Collect all match_index values, including the leader's own last log index.
    let mut indices: Vec<i64> = s.match_index.values().copied().collect();
    indices.push(s.last_log_index());
    indices.sort_by(|a, b| b.cmp(a)); // Sort descending

    let majority_idx = (s.peers.len() + 1 - 1) / 2; // Index of the median (majority) match
    
    // Safety check: ensure we have enough indices to compute the majority index
    if indices.len() <= majority_idx {
        return;
    }
    
    let n = indices[majority_idx];

    // Only commit entries from current term
    if n > s.commit_index {
        if let Some(entry) = s.log.iter().find(|e| e.index == n) {
            if entry.term == s.current_term {
                s.commit_index = n;
                info!("Leader {} advanced commit_index to {}", s.id, n);
            }
        }
    }
}

pub async fn apply_committed_loop(st: SharedState) {
    loop {
        {
            let mut s = st.lock().await;
            while s.last_applied < s.commit_index {
                let next = s.last_applied + 1;
                if let Some(e) = s.log.iter().find(|e| e.index == next).cloned() {
                    // Apply log to state machine
                    s.state_machine.insert(e.key, e.value.clone());
                    s.last_applied = next;
                    debug!("Node {} applied entry at index {} (key: {})", s.id, next, e.key);
                } else {
                    // This should not happen if logs are correct
                    info!("Node {} expected entry at index {} but couldn't find it. Breaking apply loop.", s.id, next);
                    break;
                }
            }
        }
        // Small delay to prevent busy-looping when nothing is committed
        time::sleep(Duration::from_millis(10)).await;
    }
}