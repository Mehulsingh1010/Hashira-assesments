use crate::raft_state::{SharedState, RequestVoteArgs, RequestVoteResponse, AppendEntriesArgs, AppendEntriesResponse, ClientSet, ClientSetResp, ClientGetResp, Role, LogEntry};
use axum::{
    extract::{Path, State},
    http::StatusCode,
    Json,
};
use std::{cmp, time::Duration};
use tokio::time;
use tracing::{debug, info};

// Expose internal functions required by handlers/loops but not necessary elsewhere
use super::raft_state::current_ms;
use super::background_tasks::update_commit_index;



pub async fn request_vote_handler(
    State(st): State<SharedState>,
    Json(args): Json<RequestVoteArgs>,
) -> (StatusCode, Json<RequestVoteResponse>) {
    let mut s = st.lock().await;
    
    if args.term < s.current_term {
        return (
            StatusCode::OK,
            Json(RequestVoteResponse {
                term: s.current_term,
                vote_granted: false,
            }),
        );
    }
    
    if args.term > s.current_term {
        s.current_term = args.term;
        s.voted_for = None;
        s.role = Role::Follower;
    }
    
    let up_to_date = (args.last_log_term > s.last_log_term())
        || (args.last_log_term == s.last_log_term() && args.last_log_index >= s.last_log_index());
    
    let vote_granted = if (s.voted_for.is_none() || s.voted_for == Some(args.candidate_id))
        && up_to_date
    {
        s.voted_for = Some(args.candidate_id);
        s.last_heartbeat_ms = current_ms();
        debug!("Node {} voted for {} in term {}", s.id, args.candidate_id, s.current_term);
        true
    } else {
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

    if args.term < s.current_term {
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

    if args.term >= s.current_term {
        s.current_term = args.term;
        s.role = Role::Follower;
        s.voted_for = None;
    }
    
    s.last_heartbeat_ms = current_ms();

    if args.prev_log_index > 0 {
        match s.log.iter().find(|e| e.index == args.prev_log_index) {
            Some(e) => {
                if e.term != args.prev_log_term {
                    let conflict_term = e.term;
                    let conflict_index = s
                        .log
                        .iter()
                        .find(|x| x.term == conflict_term)
                        .map(|x| x.index)
                        .unwrap_or(1);
                    
                    debug!("Node {} conflict at index {} term mismatch", s.id, args.prev_log_index);
                    
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
                debug!("Node {} missing entry at index {}", s.id, args.prev_log_index);
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

    for entry in args.entries.iter() {
        if let Some(pos) = s.log.iter().position(|e| e.index == entry.index) {
            if s.log[pos].term != entry.term {
                s.log.truncate(pos);
                s.log.push(entry.clone());
            }
        } else {
            s.log.push(entry.clone());
        }
    }

    if args.leader_commit > s.commit_index {
        s.commit_index = cmp::min(args.leader_commit, s.last_log_index());
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

pub async fn client_set_handler(
    State(st): State<SharedState>,
    Json(req): Json<ClientSet>,
) -> (StatusCode, Json<ClientSetResp>) {
    // if leader
    {
        let s = st.lock().await;
        if s.role != Role::Leader {
            return (
                StatusCode::OK,
                Json(ClientSetResp {
                    status: "not_leader".into(),
                    index: None,
                }),
            );
        }
    }


    {
        let s = st.lock().await;
        if let Some(_) = s.get_from_db(req.key).await {
            return (
                StatusCode::OK,
                Json(ClientSetResp {
                    status: "Key already exists".into(),
                    index: None,
                }),
            );
        }
    }

    // append to leader's log
    let (index, _term) = {
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
        (idx, t)
    };

    //  for replication and commit wait
    for _ in 0..20 {
        time::sleep(Duration::from_millis(50)).await;
        
        let s = st.lock().await;
        if s.commit_index >= index {
            return (
                StatusCode::OK,
                Json(ClientSetResp {
                    status: "committed".into(),
                    index: Some(index),
                }),
            );
        }
    }

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
    // Read directly from MongoDB /// any node can serve reads
    let s = st.lock().await;
    let value = s.get_from_db(key).await;
    
    (
        StatusCode::OK,
        Json(ClientGetResp {
            found: value.is_some(),
            value,
        }),
    )
}

pub async fn status_handler(State(st): State<SharedState>) -> (StatusCode, Json<serde_json::Value>) {
    let s = st.lock().await;
    
    // Get all keys 
    let mut store = std::collections::HashMap::new();
    if let Ok(mut cursor) = s.kv_collection.find(None, None).await {
        use futures::stream::StreamExt;
        while let Some(Ok(doc)) = cursor.next().await {
            if let (Ok(key), Ok(value)) = (doc.get_i64("key"), doc.get_str("value")) {
                store.insert(key, value.to_string());
            }
        }
    }
    
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
        "store": store,
    });
    (StatusCode::OK, Json(report))
}