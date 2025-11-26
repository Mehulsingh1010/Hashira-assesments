use crate::config::{LogEntry, PeerInfo};
use reqwest::Client;
use std::{collections::HashMap, time::Duration};
use tokio::sync::Mutex;
use std::sync::Arc;

#[derive(Debug, PartialEq, Eq, Clone, Copy)]
pub enum Role {
    Follower,
    Candidate,
    Leader,
}

/// The core state of the Raft consensus algorithm for a single node.
pub struct RaftState {
    pub id: usize,
    pub role: Role,
    pub current_term: u64,
    pub voted_for: Option<usize>,

    pub log: Vec<LogEntry>,
    pub commit_index: i64,
    pub last_applied: i64,

    // Leader volatile state (reinitialized upon becoming leader)
    pub next_index: HashMap<usize, i64>,
    pub match_index: HashMap<usize, i64>,

    // Cluster configuration
    pub peers: Vec<PeerInfo>,
    pub client: Client,

    // State machine (the key-value store in this case)
    pub state_machine: HashMap<i64, String>,

    // Election timeout tracking
    pub last_heartbeat_ms: u128,
}

pub type SharedState = Arc<Mutex<RaftState>>;

impl RaftState {
    pub fn new(id: usize, peers: Vec<PeerInfo>) -> Self {
        Self {
            id,
            role: Role::Follower,
            current_term: 0,
            voted_for: None,
            log: vec![],
            commit_index: 0,
            last_applied: 0,
            next_index: HashMap::new(),
            match_index: HashMap::new(),
            peers,
            client: Client::builder()
                .timeout(Duration::from_millis(100))
                .build()
                .unwrap(),
            state_machine: HashMap::new(),
            last_heartbeat_ms: current_ms(),
        }
    }

    pub fn last_log_index(&self) -> i64 {
        self.log.last().map(|e| e.index).unwrap_or(0)
    }

    pub fn last_log_term(&self) -> u64 {
        self.log.last().map(|e| e.term).unwrap_or(0)
    }

    /// Returns the term of the log entry at `index`. Returns 0 if `index` is 0.
    pub fn get_log_term(&self, index: i64) -> Option<u64> {
        if index == 0 {
            return Some(0);
        }
        self.log.iter().find(|e| e.index == index).map(|e| e.term)
    }

    pub fn majority(&self) -> usize {
        // Total number of nodes is self + peers
        (self.peers.len() + 1 + 1) / 2
    }
}

/// Gets the current time in milliseconds since the Unix epoch.
pub fn current_ms() -> u128 {
    use std::time::SystemTime;
    SystemTime::now()
        .duration_since(SystemTime::UNIX_EPOCH)
        .map(|d| d.as_millis())
        .unwrap_or(0)
}