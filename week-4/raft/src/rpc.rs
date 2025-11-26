// src/rpc.rs
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct RequestVoteArgs {
    pub term: u64,
    pub candidate_id: u64,
    pub last_log_index: u64,
    pub last_log_term: u64,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct RequestVoteReply {
    pub term: u64,
    pub vote_granted: bool,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct AppendEntriesArgs {
    pub term: u64,
    pub leader_id: u64,
    pub prev_log_index: u64,
    pub prev_log_term: u64,
    pub entries: Vec<crate::node::LogEntry>,
    pub leader_commit: u64,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct AppendEntriesReply {
    pub term: u64,
    pub success: bool,
}