use crossbeam::channel;
use csv::ReaderBuilder;
use serde::{Deserialize, Serialize};
use std::fs::File;
use std::io::Write;
use std::thread;

#[derive(Debug, Deserialize, Serialize)]
struct Transaction {
    transaction_id: String,
    category: String,
    amount: f64,
    currency: String,
    description: String,
}

fn main() -> anyhow::Result<()> {

    // tx/send_tx: producer -> workers (Transaction)
    // out_tx/send_out: workers -> main (JSON strings)
    let (send_tx, recv_tx) = channel::unbounded::<Transaction>();
    let (send_out, recv_out) = channel::unbounded::<String>();

    // Workers will receive Transaction, convert to JSON string, and send to out channel.
    let worker_count = 4; 
    for id in 0..worker_count {
        let rx = recv_tx.clone();
        let out = send_out.clone();

        thread::spawn(move || {
            // Each worker loops until the recv channel is closed.
            while let Ok(txn) = rx.recv() {
                // Convert Transaction -> compact JSON string
                if let Ok(s) = serde_json::to_string(&txn) {
                    // If sending fails, main probably exited; ignore error and stop.
                    if out.send(s).is_err() {
                        break;
                    }
                }
                // activity
                println!("[worker {}] converted {}", id, txn.transaction_id);
            }
            // When rx is closed and emptied, worker exits.
            println!("[worker {}] exiting", id);
        });
    }


    // recv_out will eventually see channel closed and the loop will finish.
    drop(send_out);


    // Use csv::Reader so quoted fields and commas inside quotes are handled correctly.
    let mut rdr = ReaderBuilder::new()
        .has_headers(true)
        .from_path("data.csv")?;

    for result in rdr.deserialize::<Transaction>() {
        match result {
            Ok(record) => {
                // Send; if send fails, workers are gone — break early.
                if send_tx.send(record).is_err() {
                    break;
                }
            }
            Err(err) => {
                // Skip malformed row but print an informative message
                eprintln!("CSV parse error (skipping row): {}", err);
            }
        }
    }

    // Close producer side so workers know there's no more work.
    drop(send_tx);

    let mut out_file = File::create("output.jsonl")?;
    // Receive loop: will end when all worker senders are dropped.
    while let Ok(json_line) = recv_out.recv() {
        writeln!(out_file, "{}", json_line)?;
    }

    println!("Conversion complete → output.jsonl");
    Ok(())
}
