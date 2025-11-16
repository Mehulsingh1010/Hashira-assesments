use crossbeam::channel;//for multi producer multi consumner comunication. multiple workers can reiceve from the same channel
use csv::ReaderBuilder;//import csv reader thathandle complexx formats like qwuotes commas etc
use serde_json::{json, Value};//macro for building json
use std::fs::File;//creating and opneing files
use std::io::Write;//provides macro writeln! method for writing files
use std::thread;//for spawning paralelle threads
use clap::Parser;//CLi for argument exchange

#[derive(Parser, Debug)]//auto generates cli parsing from struct
struct Args {//here we form all thhe -- commands 
    #[arg(short, long, default_value = "data.csv")]
    input: String,//takes a string literal

    #[arg(short, long, default_value = "output.jsonl")]
    output: String,//takes a string literal

    #[arg(short, long, default_value_t = 4)]//defauolt_val_t for taking in typed ones
    worker: usize,
}

fn main() -> anyhow::Result<()> {//result return for error handeling and anyhow accepts any  kind error type and () means no val on success
    let args = Args::parse();//shows help on --help and other than that reads std::env::args() validates input and exit with errr msg if arguments are invalid

    println!("Starting conversion...");
    println!("Input: {}", args.input);
    println!("Output: {}", args.output);
    println!("Workers: {}", args.worker);
    //we destructured for the summary print

    // Structure: (row_index, headers, values)
    let (send_tx, recv_tx) = channel::unbounded::<(usize, Vec<String>, Vec<String>)>();//Creates first channel for sending work to workers; unbounded since no size limit on msg waiting
    let (send_out, recv_out) = channel::unbounded::<(usize, String)>();//creates second channel for workers to send back result and main thread yses this to rcieve the output results

    // Spawn workers
    for id in 0..args.worker {//simply looping from workers and id is the working number for debugging
        let rx = recv_tx.clone();
        let out = send_out.clone();
        //cloning since the move already took ownership of thethread so now we have ot refrence it instead of taking ownership

        thread::spawn(move || {//spawns a new paralelle worker thread, move takes ownership of rx out and id imnot the thread, the cod e inside runs in parallel witht the main thread
            while let Ok((idx, headers, values)) = rx.recv() {//recioeves worker form channel one by one,
                // Build JSON preserving exact column order
                let mut json_str = String::from("{");//Ccreating the json manusally to avoid orger missarange
                for (i, (header, value)) in headers.iter().zip(values.iter()).enumerate() {
                    if i > 0 {
                        json_str.push(',');
                    }
                    // Properly escape the value as JSON
                    let escaped_value = serde_json::to_string(value).unwrap_or_else(|_| "\"\"".to_string());
                    json_str.push_str(&format!("\"{}\":{}", header, escaped_value));
                }
                json_str.push('}');

                if out.send((idx, json_str)).is_err() {
                    break;
                }
                println!("[worker {}] converted row {}", id, idx);
            }
            println!("[worker {}] exiting", id);
        });
    }

    drop(send_out);

    // Read CSV
    let mut rdr = ReaderBuilder::new()
        .has_headers(true)
        .from_path(&args.input)?;

    let headers: Vec<String> = rdr.headers()?.iter().map(|h| h.to_string()).collect();

    for (idx, result) in rdr.records().enumerate() {
        match result {
            Ok(record) => {
                let values: Vec<String> = record.iter().map(|v| v.to_string()).collect();
                if send_tx.send((idx, headers.clone(), values)).is_err() {
                    break;
                }
            }
            Err(err) => {
                eprintln!("CSV parse error (skipping row): {}", err);
            }
        }
    }

    drop(send_tx);

    // Collect all results with their original indices
    let mut results: Vec<(usize, String)> = Vec::new();
    while let Ok((idx, json_line)) = recv_out.recv() {
        results.push((idx, json_line));
    }

    // Sort by original row index to preserve order
    results.sort_by_key(|(idx, _)| *idx);

    // Write output in correct order
    let mut out_file = File::create(&args.output)?;
    for (_, json_line) in results {
        writeln!(out_file, "{}", json_line)?;
    }

    println!("Conversion complete → {}", args.output);
    Ok(())
}