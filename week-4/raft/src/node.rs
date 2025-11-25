// src/node.rs
use rusqlite::Connection;
use std::sync::{Arc, Mutex};
use tokio::time::Instant;
use std::collections::HashMap;
use serde::{Deserialize, Serialize};
#[derive(Debug, Clone, Copy, PartialEq)]
pub enum Role {
    Follower,
    Candidate,
    Leader,
}

#[derive(Debug, Clone)]
pub struct RaftNode {
    pub id: u64,
    pub role: Role,
    pub current_term: u64,
    pub voted_for: Option<u64>,
    pub log: Vec<LogEntry>,
    pub commit_index: u64,
    pub last_applied: u64,
    pub last_heartbeat: Instant,
    pub db: Arc<Mutex<Connection>>,
    pub votes_received: u32, // Track votes during election
    pub peer_health: HashMap<u64, Instant>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct LogEntry {
    pub term: u64,
    pub command: String, // JSON serialized KV command
}

impl RaftNode {
    pub fn new(id: u64) -> Self {
        let db = Connection::open_in_memory().unwrap();
        db.execute(
            "CREATE TABLE IF NOT EXISTS kv (key TEXT PRIMARY KEY, value TEXT)",
            [],
        ).unwrap();

        Self {
            id,
            role: Role::Follower,
            current_term: 0,
            voted_for: None,
            log: vec![],
            commit_index: 0,
            last_applied: 0,
            last_heartbeat: Instant::now(),
            db: Arc::new(Mutex::new(db)),
            votes_received: 0,
            peer_health: HashMap::new(),
        }
    }

    pub fn handle_request_vote(
        &mut self,
        candidate_id: u64,
        term: u64,
        last_log_index: u64,
        last_log_term: u64,
    ) -> bool {
        // If candidate's term is higher, update our term
        if term > self.current_term {
            self.current_term = term;
            self.voted_for = None;
            self.role = Role::Follower;
        }

        // Reject if candidate's term is outdated
        if term < self.current_term {
            return false;
        }

        // Reject if we already voted for someone else this term
        if let Some(voted) = self.voted_for {
            if voted != candidate_id {
                return false;
            }
        }

        // Check if candidate's log is at least as up-to-date as ours
        let our_last_log_term = self.log.last().map(|e| e.term).unwrap_or(0);
        let our_last_log_index = self.log.len() as u64;

        if last_log_term < our_last_log_term
            || (last_log_term == our_last_log_term && last_log_index < our_last_log_index)
        {
            return false;
        }

        // Grant vote
        self.voted_for = Some(candidate_id);
        true
    }

    pub fn handle_append_entries(
        &mut self,
        leader_id: u64,
        term: u64,
        prev_log_index: u64,
        prev_log_term: u64,
        entries: Vec<LogEntry>,
        leader_commit_index: u64,
    ) -> bool {
        // If leader's term is higher, update our term
        if term > self.current_term {
            self.current_term = term;
            self.voted_for = None;
            self.role = Role::Follower;
        }

        // Reject if leader's term is outdated
        if term < self.current_term {
            return false;
        }

        // Accept leader and reset heartbeat timer
        self.last_heartbeat = Instant::now();
        self.role = Role::Follower;

        // Check log consistency: verify prev_log_index and prev_log_term match
        if prev_log_index > 0 {
            if prev_log_index > self.log.len() as u64 {
                return false; // Log is too short
            }
            let prev_entry = &self.log[(prev_log_index - 1) as usize];
            if prev_entry.term != prev_log_term {
                return false; // Log mismatch
            }
        }

        // Append new entries
        if !entries.is_empty() {
            // Remove conflicting entries
            self.log.truncate(prev_log_index as usize);
            self.log.extend(entries);
        }

        // Update commit index
        if leader_commit_index > self.commit_index {
            self.commit_index = leader_commit_index.min(self.log.len() as u64);
        }

        true
    }

    pub fn start_election(&mut self, num_peers: usize) {
        self.current_term += 1;
        self.role = Role::Candidate;
        self.voted_for = Some(self.id);
        self.votes_received = 1; // Vote for ourselves
        self.last_heartbeat = Instant::now();
    }

    pub fn check_election_won(&self, num_peers: usize) -> bool {
        let majority = (num_peers / 2) + 1;
        self.votes_received as usize >= majority
    }
}
