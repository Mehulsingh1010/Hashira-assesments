use mongodb::{Client as MongoClient, Collection, bson::Document, bson::doc};
use reqwest::Client;
use serde::{Deserialize, Serialize};
use std::{collections::HashMap, sync::Arc, time::{Duration, SystemTime}};
use tokio::sync::Mutex;

pub type SharedState = Arc<Mutex<RaftState>>;

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

#[derive(Debug, PartialEq, Eq, Clone, Copy)]
pub enum Role {
    Follower,
    Candidate,
    Leader,
}

#[derive(Clone, Debug)]
pub struct PeerInfo {
    pub id: usize,
    pub addr: String,
}

pub struct RaftState {
    pub id: usize,
    pub role: Role,
    pub current_term: u64,
    pub voted_for: Option<usize>,

    pub log: Vec<LogEntry>,
    pub commit_index: i64,
    pub last_applied: i64,

    // leader volatile state
    pub next_index: HashMap<usize, i64>,
    pub match_index: HashMap<usize, i64>,

    // cluster
    pub peers: Vec<PeerInfo>,
    pub client: Client,

    // election timeout tracking
    pub last_heartbeat_ms: u128,

    // database - kv collection
    pub kv_collection: Collection<Document>,
}

impl RaftState {
    pub async fn new(id: usize, peers: Vec<PeerInfo>) -> Self {
        let mongo_uri = std::env::var("MONGO_URI").unwrap_or("".into());
        let mongo_client = MongoClient::with_uri_str(&mongo_uri)
            .await
            .expect("Mongo connection failed");

        let db_name = std::env::var("DB_NAME").unwrap_or("rust_raft".into());
        let kv_collection = mongo_client.database(&db_name).collection::<Document>("kvstore");

        Self {
            id,
            role: Role::Follower,
            current_term: 0,
            voted_for: None,
            log: Vec::new(),
            commit_index: 0,
            last_applied: 0,
            next_index: HashMap::new(),
            match_index: HashMap::new(),
            peers,
            client: Client::builder()
                .timeout(Duration::from_millis(200))
                .build()
                .unwrap(),
            kv_collection,
            last_heartbeat_ms: current_ms(),
        }
    }

    pub fn last_log_index(&self) -> i64 {
        self.log.last().map(|e| e.index).unwrap_or(0)
    }

    pub fn last_log_term(&self) -> u64 {
        self.log.last().map(|e| e.term).unwrap_or(0)
    }

    pub fn get_log_term(&self, index: i64) -> Option<u64> {
        if index == 0 {
            return Some(0);
        }
        self.log.iter().find(|e| e.index == index).map(|e| e.term)
    }

    pub fn majority(&self) -> usize {
        // Majority (quorum) = floor(total_nodes/2) + 1
        let total_nodes = self.peers.len() + 1; // peers + self
        (total_nodes / 2) + 1
    }

    pub async fn get_from_db(&self, key: i64) -> Option<String> {
        let filter = doc! {"key": key};
        match self.kv_collection.find_one(filter, None).await {
            Ok(Some(doc)) => {
                doc.get_str("value").ok().map(|s| s.to_string())
            }
            _ => None,
        }
    }

    // save value to MongoDB
    pub async fn save_to_db(&self, key: i64, value: String) -> Result<(), String> {
        let filter = doc! {"key": key};
        // key already exists, do NOT update  return an existsberror
        match self.kv_collection.find_one(filter.clone(), None).await {
            Ok(Some(_)) => return Err("exists".to_string()), // Using "exists" as a specific error string
            Ok(None) => {}
            Err(e) => return Err(format!("MongoDB error (find): {}", e)),
        }

        //  new key (fail if concurrently inserted)
        let doc = doc! {"key": key, "value": &value};
        match self.kv_collection.insert_one(doc, None).await {
            Ok(_) => Ok(()),
            Err(e) => Err(format!("MongoDB error (insert): {}", e)),
        }
    }
}

pub fn current_ms() -> u128 {
    SystemTime::now()
        .duration_since(SystemTime::UNIX_EPOCH)
        .map(|d| d.as_millis())
        .unwrap_or(0)
}
