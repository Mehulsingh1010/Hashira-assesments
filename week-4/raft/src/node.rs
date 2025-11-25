// src/node.rs
use rusqlite::Connection;
use std::sync::{Arc, Mutex};
use tokio::time::Instant;

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
}

#[derive(Debug, Clone)]
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
        }
    }
}