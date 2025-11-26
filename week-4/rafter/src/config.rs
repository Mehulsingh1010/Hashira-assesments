use clap::Parser;
use serde::{Deserialize, Serialize};
use std::collections::HashMap;

/// Command line arguments for starting the Raft node.
#[derive(Parser, Debug)]
pub struct Args {
    #[arg(long)]
    pub id: usize,

    #[arg(long)]
    pub port: u16,

    /// Comma separated peer entries: id:host:port (e.g., "2:127.0.0.1:7002,3:127.0.0.1:7003")
    #[arg(long, default_value_t = String::new())]
    pub peers: String,
}

#[derive(Clone, Debug)]
pub struct PeerInfo {
    pub id: usize,
    pub addr: String,
}

// ---------------- RPC Data Structures ----------------

#[derive(Clone, Serialize, Deserialize, Debug)]
pub struct LogEntry {
    pub term: u64,
    pub index: i64,
    pub key: i64,
    pub value: String,
}

#[derive(Clone, Serialize, Deserialize, Debug)]
pub struct RequestVoteArgs {
    pub term: u64,
    pub candidate_id: usize,
    pub last_log_index: i64,
    pub last_log_term: u64,
}

#[derive(Clone, Serialize, Deserialize, Debug)]
pub struct RequestVoteResponse {
    pub term: u64,
    pub vote_granted: bool,
}

#[derive(Clone, Serialize, Deserialize, Debug)]
pub struct AppendEntriesArgs {
    pub term: u64,
    pub leader_id: usize,
    pub prev_log_index: i64,
    pub prev_log_term: u64,
    pub entries: Vec<LogEntry>,
    pub leader_commit: i64,
}

#[derive(Clone, Serialize, Deserialize, Debug)]
pub struct AppendEntriesResponse {
    pub term: u64,
    pub success: bool,
    pub conflict_index: Option<i64>,
    pub conflict_term: Option<u64>,
}

// ---------------- Client API Data Structures ----------------

#[derive(Serialize, Deserialize)]
pub struct ClientSet {
    pub key: i64,
    pub value: String,
}

#[derive(Serialize)]
pub struct ClientSetResp {
    pub status: String,
    pub index: Option<i64>,
}

#[derive(Serialize)]
pub struct ClientGetResp {
    pub found: bool,
    pub value: Option<String>,
}

// ---------------- Helper ----------------

/// Parses the comma-separated peer string into a vector of PeerInfo.
pub fn parse_peers(peer_str: &str) -> Vec<PeerInfo> {
    if peer_str.trim().is_empty() {
        return vec![];
    }
    peer_str
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
}