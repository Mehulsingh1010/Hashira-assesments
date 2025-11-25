// src/state.rs
use std::sync::{Arc, Mutex};
use crate::node::RaftNode;

#[derive(Clone)]
pub struct AppState {
    pub node: Arc<Mutex<RaftNode>>,
    pub peers: Vec<u64>,
}

impl AppState {
    pub fn new(id: u64, peers: Vec<u64>) -> Self {
        Self {
            node: Arc::new(Mutex::new(RaftNode::new(id))),
            peers,
        }
    }
}