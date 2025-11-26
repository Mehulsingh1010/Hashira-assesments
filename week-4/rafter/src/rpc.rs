use crate::config::{AppendEntriesArgs, AppendEntriesResponse, PeerInfo, RequestVoteArgs, RequestVoteResponse};
use reqwest::Client;
use tracing::debug;

/// sends a req vote RPC to a single peer.
pub async fn send_request_vote(
    client: Client,
    peer: PeerInfo,
    args: RequestVoteArgs,
) -> Option<RequestVoteResponse> {
    let url = format!("http://{}/raft/request_vote", peer.addr);
    debug!(
        "Node {} sending RequestVote to {} for term {}",
        args.candidate_id, peer.id, args.term
    );
    match client.post(&url).json(&args).send().await {
        Ok(r) => match r.json::<RequestVoteResponse>().await {
            Ok(rv) => Some(rv),
            Err(e) => {
                debug!("Error parsing RequestVote response from {}: {}", peer.id, e);
                None
            }
        },
        Err(e) => {
            debug!("Error sending RequestVote to {}: {}", peer.id, e);
            None
        }
    }
}

/// for sending an AppendEntries RPC (heartbeat or log replication) to a single peer.
pub async fn send_append_entries(
    client: Client,
    peer: PeerInfo,
    args: AppendEntriesArgs,
) -> Option<AppendEntriesResponse> {
    let url = format!("http://{}/raft/append_entries", peer.addr);
    
    // Log heartbeat or log replication
    if args.entries.is_empty() {
        debug!(
            "Leader {} sending Heartbeat to {} (prev_idx: {}) in term {}",
            args.leader_id, peer.id, args.prev_log_index, args.term
        );
    } else {
        debug!(
            "Leader {} sending {} entries to {} (prev_idx: {}) in term {}",
            args.leader_id,
            args.entries.len(),
            peer.id,
            args.prev_log_index,
            args.term
        );
    }
    
    match client.post(&url).json(&args).send().await {
        Ok(r) => match r.json::<AppendEntriesResponse>().await {
            Ok(ae_resp) => Some(ae_resp),
            Err(e) => {
                debug!("Error parsing AppendEntries response from {}: {}", peer.id, e);
                None
            }
        },
        Err(e) => {
            debug!("Error sending AppendEntries to {}: {}", peer.id, e);
            None
        }
    }
}









