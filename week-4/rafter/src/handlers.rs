use crate::config::{
    AppendEntriesArgs, AppendEntriesResponse, ClientGetResp, ClientSet, ClientSetResp,
    RequestVoteArgs, RequestVoteResponse, LogEntry,
};
use crate::state::{current_ms, SharedState, RaftState, Role};
use axum::{
    extract::{Path, State},
    http::StatusCode,
    Json,
};
use std::time::Duration;
use tokio::time;
use tracing::{debug, info};

// ---------------- Raft RPC Handlers ----------------

pub async fn request_vote_handler(
    State(st): State<SharedState>,
    Json(args): Json<RequestVoteArgs>,
) -> (StatusCode, Json<RequestVoteResponse>) {
    let mut s = st.lock().await;

    // 1. Reply false if term < currentTerm
    if args.term < s.current_term {
        debug!(
            "Node {} rejected vote from {} (term: {}) due to lower term (current: {})",
            s.id, args.candidate_id, args.term, s.current_term
        );
        return (
            StatusCode::OK,
            Json(RequestVoteResponse {
                term: s.current_term,
                vote_granted: false,
            }),
        );
    }

    // 2. If args.term > currentTerm, step down and update term
    if args.term > s.current_term {
        info!("Node {} stepping down to Follower. New Term: {}", s.id, args.term);
        s.current_term = args.term;
        s.voted_for = None;
        s.role = Role::Follower;
    }

    let up_to_date = (args.last_log_term > s.last_log_term())
        || (args.last_log_term == s.last_log_term() && args.last_log_index >= s.last_log_index());

    // 3. If votedFor is null or args.candidateId, and candidate's log is up-to-date
    let vote_granted = if (s.voted_for.is_none() || s.voted_for == Some(args.candidate_id))
        && up_to_date
    {
        s.voted_for = Some(args.candidate_id);
        s.last_heartbeat_ms = current_ms(); // Reset election timer
        debug!("Node {} voted for {} in term {}", s.id, args.candidate_id, s.current_term);
        true
    } else {
        debug!(
            "Node {} rejected vote from {} (voted_for: {:?}, up_to_date: {})",
            s.id, args.candidate_id, s.voted_for, up_to_date
        );
        false
    };

    (
        StatusCode::OK,
        Json(RequestVoteResponse {
            term: s.current_term,
            vote_granted,
        }),
    )
}

pub async fn append_entries_handler(
    State(st): State<SharedState>,
    Json(args): Json<AppendEntriesArgs>,
) -> (StatusCode, Json<AppendEntriesResponse>) {
    let mut s = st.lock().await;

    // 1. Reply false if term < currentTerm
    if args.term < s.current_term {
        debug!(
            "Node {} rejected AE from {} (term: {}) due to lower term (current: {})",
            s.id, args.leader_id, args.term, s.current_term
        );
        return (
            StatusCode::OK,
            Json(AppendEntriesResponse {
                term: s.current_term,
                success: false,
                conflict_index: None,
                conflict_term: None,
            }),
        );
    }

    // Accept higher or equal term, step down if needed
    if args.term >= s.current_term {
        if s.role != Role::Follower {
             info!(
                "Node {} stepping down to Follower. Received AE from {} in Term: {}",
                s.id, args.leader_id, args.term
            );
        }
        s.current_term = args.term;
        s.role = Role::Follower;
        s.voted_for = None; // Important: Clear voted_for on new term
    }
    
    // Log heartbeat receipt
    s.last_heartbeat_ms = current_ms();
    if args.entries.is_empty() {
        debug!("Node {} received Heartbeat from Leader {}", s.id, args.leader_id);
    } else {
        debug!("Node {} received AppendEntries with {} entries from Leader {}", s.id, args.entries.len(), args.leader_id);
    }


    // 2. Reply false if log doesn't contain an entry at prev_log_index whose term matches prev_log_term
    if args.prev_log_index > 0 {
        match s.log.iter().find(|e| e.index == args.prev_log_index) {
            Some(e) => {
                if e.term != args.prev_log_term {
                    // Conflict: return earliest index for this term
                    let conflict_term = e.term;
                    let conflict_index = s
                        .log
                        .iter()
                        .find(|x| x.term == conflict_term)
                        .map(|x| x.index)
                        .unwrap_or(1);

                    debug!(
                        "Node {} conflict at index {} (term mismatch)",
                        s.id, args.prev_log_index
                    );
                    return (
                        StatusCode::OK,
                        Json(AppendEntriesResponse {
                            term: s.current_term,
                            success: false,
                            conflict_index: Some(conflict_index),
                            conflict_term: Some(conflict_term),
                        }),
                    );
                }
            }
            None => {
                // Missing entry at prev_log_index
                debug!(
                    "Node {} missing entry at index {}",
                    s.id, args.prev_log_index
                );
                return (
                    StatusCode::OK,
                    Json(AppendEntriesResponse {
                        term: s.current_term,
                        success: false,
                        conflict_index: Some(s.last_log_index() + 1),
                        conflict_term: None,
                    }),
                );
            }
        }
    }

    // 3. If an existing entry conflicts with a new one, delete existing and all following entries
    // 4. Append any new entries not already in the log
    for entry in args.entries.iter() {
        if let Some(pos) = s.log.iter().position(|e| e.index == entry.index) {
            if s.log[pos].term != entry.term {
                // Conflict: remove conflicting entry and all that follow
                s.log.truncate(pos);
                s.log.push(entry.clone());
            }
            // else entry matches, skip
        } else if entry.index > s.last_log_index() {
            // Append if it's new and beyond the current end of the log
            s.log.push(entry.clone());
        }
    }

    // 5. If leaderCommit > commitIndex, set commitIndex = min(leaderCommit, index of last new entry)
    if args.leader_commit > s.commit_index {
        s.commit_index = std::cmp::min(args.leader_commit, s.last_log_index());
        debug!(
            "Node {} updated commit_index to {}",
            s.id, s.commit_index
        );
    }

    (
        StatusCode::OK,
        Json(AppendEntriesResponse {
            term: s.current_term,
            success: true,
            conflict_index: None,
            conflict_term: None,
        }),
    )
}

// ---------------- Client Handlers ----------------

pub async fn client_set_handler(
    State(st): State<SharedState>,
    Json(req): Json<ClientSet>,
) -> (StatusCode, Json<ClientSetResp>) {
    // Check if leader
    let (is_leader, leader_id) = {
        let s = st.lock().await;
        (s.role == Role::Leader, s.id)
    };

    if !is_leader {
        return (
            StatusCode::OK,
            Json(ClientSetResp {
                status: "not_leader".into(),
                index: None,
            }),
        );
    }

    // Append to leader's log
    let (index, term) = {
        let mut s = st.lock().await;
        let idx = s.last_log_index() + 1;
        let t = s.current_term;
        let entry = LogEntry {
            term: t,
            index: idx,
            key: req.key,
            value: req.value.clone(),
        };
        s.log.push(entry);
        info!(
            "Leader {} appended new entry at index {} (Term {})",
            s.id, idx, t
        );
        (idx, t)
    };

    // Wait for the entry to be committed (up to 1 second)
    for _ in 0..20 {
        time::sleep(Duration::from_millis(50)).await;

        let s = st.lock().await;
        if s.commit_index >= index {
            info!(
                "Leader {} entry at index {} committed successfully.",
                leader_id, index
            );
            return (
                StatusCode::OK,
                Json(ClientSetResp {
                    status: "committed".into(),
                    index: Some(index),
                }),
            );
        }
    }

    // Timeout
    info!(
        "Leader {} timed out waiting for entry at index {} to commit.",
        leader_id, index
    );
    (
        StatusCode::OK,
        Json(ClientSetResp {
            status: "timeout".into(),
            index: Some(index),
        }),
    )
}

pub async fn client_get_handler(
    State(st): State<SharedState>,
    Path(key): Path<i64>,
) -> (StatusCode, Json<ClientGetResp>) {
    let s = st.lock().await;
    let v = s.state_machine.get(&key).cloned();
    (
        StatusCode::OK,
        Json(ClientGetResp {
            found: v.is_some(),
            value: v,
        }),
    )
}

pub async fn status_handler(State(st): State<SharedState>) -> (StatusCode, Json<serde_json::Value>) {
    let s = st.lock().await;
    let report = serde_json::json!({
        "id": s.id,
        "role": format!("{:?}", s.role),
        "term": s.current_term,
        "voted_for": s.voted_for,
        "last_log_index": s.last_log_index(),
        "last_log_term": s.last_log_term(),
        "commit_index": s.commit_index,
        "last_applied": s.last_applied,
        "log_length": s.log.len(),
        "store_size": s.state_machine.len(),
    });
    (StatusCode::OK, Json(report))
}