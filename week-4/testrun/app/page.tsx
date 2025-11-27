/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import * as http from "http";
import { URL } from "url";

// -----------------------------------------------------------------
// INTERFACES AND ENUMS
// -----------------------------------------------------------------

enum NodeState {
  Follower = "Follower",
  Candidate = "Candidate",
  Leader = "Leader",
}

interface Peer {
  id: number;
  address: string;
}

interface LogEntry {
  term: number;
  index: number;
  key: number;
  value: string;
}

interface RequestVoteRequest {
  term: number;
  candidate_id: number;
  last_log_index: number;
  last_log_term: number;
}

interface RequestVoteResponse {
  term: number;
  vote_granted: boolean;
}

interface AppendEntriesRequest {
  term: number;
  leader_id: number;
  prev_log_index: number;
  prev_log_term: number;
  entries: LogEntry[];
  leader_commit: number;
}

interface AppendEntriesResponse {
  term: number;
  success: boolean;
  conflict_index?: number;
  conflict_term?: number;
}

interface ClientRequest {
  key: number;
  value: string;
}

interface ClientResponse {
  success: boolean;
  value?: string;
  leader?: string;
}

interface NodeStatus {
  node_id: number;
  state: NodeState;
  current_term: number;
  voted_for: number | null;
  is_leader: boolean;
  peers_count: number;
  log_length: number;
  commit_index: number;
  last_applied: number;
  store: Record<number, string>;
}


// -----------------------------------------------------------------
// RAFT NODE CLASS
// -----------------------------------------------------------------

class RaftNode {
  private id: number;
  private peers: Peer[];

  private current_term: number = 0;
  private voted_for: number | null = null;
  // NOTE: Log starts conceptually at index 1.
  private log: LogEntry[] = []; 

  private state: NodeState = NodeState.Follower;
  private commit_index: number = 0;
  private last_applied: number = 0;
  private last_heartbeat: number = Date.now();

  private next_index: Map<number, number> = new Map();
  private match_index: Map<number, number> = new Map();

  private kv_store: Map<number, string> = new Map();

  private readonly ELECTION_TIMEOUT_MIN = 150;
  private readonly ELECTION_TIMEOUT_MAX = 300;
  private readonly HEARTBEAT_INTERVAL = 50;

  constructor(id: number, peers: Peer[]) {
    this.id = id;
    this.peers = peers;
    this.reset_election_timer();
  }
  
  private reset_election_timer(): void {
    this.last_heartbeat = Date.now();
  }

  private get_election_timeout(): number {
    // Returns a randomized timeout between min and max (inclusive)
    return Math.floor(
      Math.random() * (this.ELECTION_TIMEOUT_MAX - this.ELECTION_TIMEOUT_MIN) +
      this.ELECTION_TIMEOUT_MIN
    );
  }

  private last_log_index(): number {
    const last = this.log[this.log.length - 1];
    return last ? last.index : 0;
  }

  private last_log_term(): number {
    const last = this.log[this.log.length - 1];
    return last ? last.term : 0;
  }

  private get_log_term(index: number): number {
    if (index === 0) return 0;
    // Raft index vs. JS array index offset
    const entry = this.log.find((e) => e.index === index);
    return entry ? entry.term : 0;
  }

  private majority(): number {
    // +1 for self, so +2 total
    return Math.floor((this.peers.length + 1) / 2);
  }
  
  // --- CLIENT HANDLERS ---
  
  public async handle_get(key: number): Promise<ClientResponse> {
    const value = this.kv_store.get(key);
    return {
      success: value !== undefined,
      value: value,
    };
  }

  public async handle_set(request: ClientRequest): Promise<ClientResponse> {
    if (this.state !== NodeState.Leader) {
      // Find the supposed leader to redirect the client
      const leader_peer = this.peers.find((p) => p.id === this.voted_for);
      return {
        success: false,
        leader: leader_peer?.address,
      };
    }

    const new_index = this.last_log_index() + 1;
    const entry: LogEntry = {
      term: this.current_term,
      index: new_index,
      key: request.key,
      value: request.value,
    };
    this.log.push(entry);
    console.log(`📝 Leader ${this.id}: Appended entry at index ${new_index}`);
    
    // Asynchronously replicate the entry and wait for commit
    this.send_append_entries_to_all();
    
    await this.wait_for_commit(new_index);
    return { success: true, value: "Commit successful" };
  }

  private async wait_for_commit(index: number): Promise<void> {
    const max_wait = 1000; // 1 second timeout
    const start = Date.now();

    while (Date.now() - start < max_wait) {
      if (this.commit_index >= index) {
        return;
      }
      // Wait for a short period before checking commit_index again
      await new Promise((resolve) => setTimeout(resolve, 50)); 
    }
    throw new Error(`Commit timeout: entry index ${index} not committed within ${max_wait}ms.`);
  }

  // --- RAFT RPC HANDLERS ---

  public async handle_request_vote(
    request: RequestVoteRequest
  ): Promise<RequestVoteResponse> {
    // 1. If term < current_term, reply false
    if (request.term < this.current_term) {
      return { term: this.current_term, vote_granted: false };
    }
    
    // 2. If term > current_term, update term and become Follower
    if (request.term > this.current_term) {
      this.current_term = request.term;
      this.voted_for = null;
      this.state = NodeState.Follower;
    }

    // Log Matching Rule (part b)
    const log_ok =
      request.last_log_term > this.last_log_term() ||
      (request.last_log_term === this.last_log_term() &&
        request.last_log_index >= this.last_log_index());

    // 3. Grant vote if: (a) hasn't voted or already voted for candidate, AND (b) log is up-to-date
    const vote_granted =
      (this.voted_for === null || this.voted_for === request.candidate_id) &&
      log_ok;

    if (vote_granted) {
      this.voted_for = request.candidate_id;
      this.reset_election_timer();
      console.log(
        `✅ Node ${this.id}: Voted for ${request.candidate_id} in term ${this.current_term}`
      );
    }

    return { term: this.current_term, vote_granted };
  }

  public async handle_append_entries(
    request: AppendEntriesRequest
  ): Promise<AppendEntriesResponse> {
    // 1. Reply false if term < currentTerm
    if (request.term < this.current_term) {
      return { term: this.current_term, success: false };
    }

    // 2. If term >= currentTerm, update term and become Follower (heartbeats confirm leader)
    if (request.term >= this.current_term) {
      this.current_term = request.term;
      this.state = NodeState.Follower;
      this.voted_for = null;
    }

    this.reset_election_timer(); // Valid leader/heartbeat received

    // 3. Reply false if log doesn't contain entry at prev_log_index whose term matches prev_log_term
    if (request.prev_log_index > 0) {
      const prev_entry = this.log.find(
        (e) => e.index === request.prev_log_index
      );

      // Conflict detection
      if (!prev_entry || prev_entry.term !== request.prev_log_term) {
        
        let conflict_index = this.last_log_index() + 1;
        let conflict_term: number | undefined = undefined;

        if (prev_entry) {
          // If we found the index but the term mismatched, find the first index of that term
          conflict_term = prev_entry.term;
          conflict_index = this.log.find((e) => e.term === conflict_term)?.index || 1;
        }

        return {
          term: this.current_term,
          success: false,
          conflict_index: conflict_index,
          conflict_term: conflict_term,
        };
      }
    }

    // 4. If an existing entry conflicts, delete it and all following entries
    for (const entry of request.entries) {
      const existing_idx = this.log.findIndex((e) => e.index === entry.index);

      if (existing_idx !== -1) {
        const existing = this.log[existing_idx];
        if (existing && existing.term !== entry.term) {
          // Conflict found: Truncate and replace
          this.log = this.log.slice(0, existing_idx);
          this.log.push(entry);
        }
      } else {
        // No conflict, just append
        this.log.push(entry);
      }
    }

    // 5. If leaderCommit > commitIndex, set commitIndex = min(leaderCommit, last log index)
    if (request.leader_commit > this.commit_index) {
      this.commit_index = Math.min(
        request.leader_commit,
        this.last_log_index()
      );
      console.log(`✅ Node ${this.id}: Commit index advanced to ${this.commit_index}`);
    }

    return { term: this.current_term, success: true };
  }


  // --- ELECTION LOGIC ---

  public async check_election_timeout(): Promise<void> {
    if (this.state === NodeState.Leader) {
      return; // Leader uses heartbeat timer
    }

    const elapsed = Date.now() - this.last_heartbeat;
    const timeout = this.get_election_timeout();

    if (elapsed >= timeout) {
      await this.start_election();
    }
  }

  private async start_election(): Promise<void> {
    if (this.peers.length === 0) {
      this.become_leader();
      return;
    }

    this.state = NodeState.Candidate;
    this.current_term += 1;
    this.voted_for = this.id;
    this.reset_election_timer();

    console.log(
      `🗳️  Node ${this.id}: Starting election for term ${this.current_term}`
    );

    const vote_request: RequestVoteRequest = {
      term: this.current_term,
      candidate_id: this.id,
      last_log_index: this.last_log_index(),
      last_log_term: this.last_log_term(),
    };

    const vote_promises = this.peers.map((peer) =>
      this.request_vote_from_peer(peer, vote_request)
    );

    const responses = await Promise.all(vote_promises);

    let votes = 1; // Vote for self
    let higher_term_seen = false;

    for (const response of responses) {
      if (response) {
        // Rule: If RPC response contains term T > currentTerm, set currentTerm = T, convert to follower
        if (response.term > this.current_term) {
          higher_term_seen = true;
          this.current_term = response.term;
          this.state = NodeState.Follower;
          this.voted_for = null;
          console.log(`Node ${this.id}: Saw higher term ${response.term}. Stepping down.`);
          break;
        }
        if (response.vote_granted) {
          votes++;
        }
      }
    }

    if (higher_term_seen) {
      return;
    }

    // Win election if majority achieved and still a Candidate
    if (this.state === NodeState.Candidate && votes >= this.majority()) {
      this.become_leader();
    } else if (this.state === NodeState.Candidate) {
      // Election failed, return to Follower (or keep waiting)
      this.reset_election_timer();
    }
  }

  private async request_vote_from_peer(
    peer: Peer,
    request: RequestVoteRequest
  ): Promise<RequestVoteResponse | null> {
    try {
      const response = await axios.post<RequestVoteResponse>(
        `${peer.address}/raft/request_vote`,
        request,
        { timeout: 100 }
      );
      return response.data;
    } catch (error) {
      return null; // Connection failure
    }
  }

  // --- LEADER LOGIC ---

  private become_leader(): void {
    this.state = NodeState.Leader;
    console.log(
      `👑 Node ${this.id}: Became LEADER for term ${this.current_term}`
    );

    const next_idx = this.last_log_index() + 1;
    this.next_index.clear();
    this.match_index.clear();

    // Initialize all followers' nextIndex to leader's last log index + 1
    for (const peer of this.peers) {
      this.next_index.set(peer.id, next_idx);
      this.match_index.set(peer.id, 0);
    }

    this.leader_heartbeat();
  }

  private async leader_heartbeat(): Promise<void> {
    while (this.state === NodeState.Leader) {
      await this.send_append_entries_to_all();

      // Wait for the heartbeat interval
      await new Promise((resolve) =>
        setTimeout(resolve, this.HEARTBEAT_INTERVAL)
      );
    }
  }
  
  // Sends AppendEntries RPCs to all peers concurrently
  private async send_append_entries_to_all(): Promise<void> {
    if (this.state !== NodeState.Leader) return;

    const heartbeat_promises = this.peers.map((peer) =>
      this.send_append_entries(peer)
    );
    await Promise.all(heartbeat_promises);
  }


  private async send_append_entries(peer: Peer): Promise<void> {
    if (this.state !== NodeState.Leader) return;

    const next_idx = this.next_index.get(peer.id) || 1;
    const prev_log_index = next_idx - 1;
    const prev_log_term = this.get_log_term(prev_log_index);

    // Entries to send (empty array for heartbeats)
    const entries = this.log.filter((e) => e.index >= next_idx); 

    const request: AppendEntriesRequest = {
      term: this.current_term,
      leader_id: this.id,
      prev_log_index,
      prev_log_term,
      entries,
      leader_commit: this.commit_index,
    };

    try {
      const response = await axios.post<AppendEntriesResponse>(
        `${peer.address}/raft/append_entries`,
        request,
        { timeout: 100 }
      );

      // Must re-check role, as we might have stepped down while awaiting the response
      if (this.state !== NodeState.Leader) return; 

      // 1. If RPC response contains term T > currentTerm, step down
      if (response.data.term > this.current_term) {
        this.current_term = response.data.term;
        this.state = NodeState.Follower;
        this.voted_for = null;
        console.log(`Leader ${this.id}: Saw higher term ${this.current_term} from peer ${peer.id}. Stepping down.`);
        return;
      }

      if (response.data.success) {
        // Success: Update nextIndex and matchIndex
        if (request.entries.length > 0) {
          const lastEntry = request.entries[request.entries.length - 1];
          if (lastEntry) {
            const last_idx = lastEntry.index;
            this.next_index.set(peer.id, last_idx + 1);
            this.match_index.set(peer.id, last_idx);
          }
        }
        this.update_commit_index();
      } else {
        // Failure: Decrement nextIndex and retry (Log Matching)
        const conflict_idx = response.data.conflict_index || next_idx - 1;
        this.next_index.set(peer.id, Math.max(conflict_idx, 1));
      }
    } catch (error) {
      // Connection failure: Peer might be down, will retry on next heartbeat
    }
  }

  private update_commit_index(): void {
    if (this.state !== NodeState.Leader) return;

    // Collect all match indices (including self's last log index)
    const indices = Array.from(this.match_index.values());
    indices.push(this.last_log_index()); 
    indices.sort((a, b) => b - a); // Sort descending

    // Find the Nth largest index (where N is the majority size)
    const majority_idx = this.majority() - 1; 
    const n = indices[majority_idx];

    // Raft Rule: If N > commitIndex, and log[N].term == currentTerm, set commitIndex = N
    if (n > this.commit_index) {
      const entry = this.log.find((e) => e.index === n);
      if (entry && entry.term === this.current_term) {
        this.commit_index = n;
        console.log(`✅ Leader ${this.id}: Advanced commit_index to ${n}`);
      }
    }
  }


  // --- STATE MACHINE ---

  public async apply_committed_entries(): Promise<void> {
    while (true) {
      while (this.last_applied < this.commit_index) {
        const next = this.last_applied + 1;
        const entry = this.log.find((e) => e.index === next);

        if (entry) {
          // Apply to KV store
          this.kv_store.set(entry.key, entry.value);
          this.last_applied = next;
          console.log(
            `📥 Node ${this.id}: Applied entry at index ${next} (${entry.key}=${entry.value})`
          );
        } else {
          // Should not happen if log is consistent
          break;
        }
      }
      // Wait before checking for new committed entries
      await new Promise((resolve) => setTimeout(resolve, 50)); 
    }
  }

  // --- STATUS ---

  public get_status(): NodeStatus {
    return {
      node_id: this.id,
      state: this.state,
      current_term: this.current_term,
      voted_for: this.voted_for,
      is_leader: this.state === NodeState.Leader,
      peers_count: this.peers.length,
      log_length: this.log.length,
      commit_index: this.commit_index,
      last_applied: this.last_applied,
      store: Object.fromEntries(this.kv_store),
    };
  }
}


// -----------------------------------------------------------------
// MAIN FUNCTION (Native Node.js HTTP Server)
// -----------------------------------------------------------------

async function main() {
  const node_id = parseInt(process.env.NODE_ID || "5");
  const port = parseInt(process.env.PORT || "7005");

  console.log(`\n🚀 Starting Raft Key-Value Store - Node ${node_id}`);
  console.log(`📡 Server: http://localhost:${port}`);
  console.log(`\n👥 CLIENT ENDPOINTS:`);
  console.log(`  GET  /client/get/:key  - Read value`);
  console.log(`  POST /client/set       - Write value`);
  console.log(`  GET  /status           - Node status`);

  // Peer list setup (use appropriate IP addresses for your network)
// Inside async function main() in raftNode.ts

const all_peers: Peer[] = [
    // Ensure all peers (including yourself) are listed here:
    { id: 1, address: "http://192.168.137.68:7001" }, // Himanshu
    { id: 2, address: "http://192.168.137.131:7002" }, // Mehul
    { id: 3, address: "http://192.168.138.252:7003" }, // Srishti
    { id: 4, address: "http://192.168.138.79:7004" },  // Ajas
    { id: 5, address: "http://192.168.137.144:7005" }, // Shaurya (You)
    { id: 6, address: "http://192.168.137.145:7006" }, // Rahul
];

  // Filter out the current node from the peer list
  const peers = all_peers.filter((p) => p.id !== node_id); 
  
  const node = new RaftNode(node_id, peers);

  // Start Raft background loops: Election/Heartbeat/Application
  setInterval(() => node.check_election_timeout(), 100);
  node.apply_committed_entries();
  
  
  // Helper to read the entire JSON body from a request stream
  const get_body = (req: http.IncomingMessage): Promise<any> => {
    return new Promise((resolve, reject) => {
      let body = '';
      req.on('data', chunk => {
        body += chunk.toString();
      });
      req.on('end', () => {
        try {
          // Axios JSON responses often return an empty body for heartbeats/status, handle it.
          resolve(body ? JSON.parse(body) : {});
        } catch (e) {
          reject(new Error("Failed to parse JSON body."));
        }
      });
      req.on('error', reject);
    });
  };

  const server = http.createServer(async (req, res) => {
    const full_url = new URL(req.url || '/', `http://localhost:${port}`);
    const path = full_url.pathname;
    const method = req.method;

    // Set standard response headers
    res.setHeader('Content-Type', 'application/json');
    
    let response_data: any;
    let status_code = 200;

    try {
      switch (`${method} ${path}`) {
        // --- CLIENT GET / RAFT STATUS ---
        case `GET ${path}`:
          if (path.startsWith('/client/get/')) {
            // Manual path parameter extraction for /client/get/:key
            const key_str = path.split('/').pop();
            const key = key_str ? parseInt(key_str) : NaN;
            
            if (isNaN(key)) {
              status_code = 400;
              response_data = { success: false, message: 'Invalid key format.' };
            } else {
              response_data = await node.handle_get(key);
            }
          } else if (path === '/status') {
            response_data = node.get_status();
          } else {
            status_code = 404;
            response_data = { success: false, message: 'Not Found' };
          }
          break;

        // --- POST Handlers (SET, RPCs) ---
        case 'POST /client/set': {
          const request: ClientRequest = await get_body(req);
          response_data = await node.handle_set(request);
          break;
        }
        case 'POST /raft/request_vote': {
          const request: RequestVoteRequest = await get_body(req);
          response_data = await node.handle_request_vote(request);
          break;
        }
        case 'POST /raft/append_entries': {
          const request: AppendEntriesRequest = await get_body(req);
          response_data = await node.handle_append_entries(request);
          break;
        }
        default:
          status_code = 404;
          response_data = { success: false, message: 'Not Found' };
          break;
      }
    } catch (error: any) {
      // Catch errors from within the Raft node logic (e.g., commit timeout)
      console.error(`ERROR PROCESSING ${method} ${path}:`, error.message);
      status_code = 500;
      response_data = { success: false, message: 'Internal Server Error', detail: error.message };
    }

    // Send the final response
    res.writeHead(status_code);
    res.end(JSON.stringify(response_data));
  });

  server.listen(port, () => {
    console.log(`✅ Server listening on port ${port}`);
  });
}

main().catch(console.error);