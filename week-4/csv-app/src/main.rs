use axum::{
    extract::Multipart,
    http::StatusCode,
    response::IntoResponse,
    routing::post,
    Router,
};
use crossbeam::channel;
use csv::ReaderBuilder;
use serde::{Deserialize, Serialize};
use std::io::Write;
use std::thread;
use tower_http::cors::{CorsLayer, Any};

#[derive(Debug, Deserialize, Serialize)]
struct Transaction {
    transaction_id: String,
    category: String,
    amount: f64,
    currency: String,
    description: String,
}

#[tokio::main]
async fn main() {
    let app = Router::new()
        .route("/convert", post(convert_csv))
        .layer(
            CorsLayer::new()
                .allow_origin(Any)
                .allow_methods(Any)
                .allow_headers(Any),
        );

    let listener = tokio::net::TcpListener::bind("127.0.0.1:3001")
        .await
        .unwrap();
    
    println!("Server running on http://127.0.0.1:3001");
    axum::serve(listener, app).await.unwrap();
}

async fn convert_csv(mut multipart: Multipart) -> impl IntoResponse {
    // Extract CSV data from multipart form
    let mut csv_data = Vec::new();
    
    while let Some(field) = multipart.next_field().await.unwrap() {
        if field.name() == Some("file") {
            csv_data = field.bytes().await.unwrap().to_vec();
            break;
        }
    }

    if csv_data.is_empty() {
        return (StatusCode::BAD_REQUEST, "No file uploaded".to_string());
    }

    // Process CSV
    match process_csv(&csv_data) {
        Ok(jsonl) => (StatusCode::OK, jsonl),
        Err(e) => (StatusCode::INTERNAL_SERVER_ERROR, format!("Error: {}", e)),
    }
}

fn process_csv(csv_data: &[u8]) -> Result<String, Box<dyn std::error::Error>> {
    let (send_tx, recv_tx) = channel::unbounded::<Transaction>();
    let (send_out, recv_out) = channel::unbounded::<String>();

    // Spawn workers
    let worker_count = 4;
    for id in 0..worker_count {
        let rx = recv_tx.clone();
        let out = send_out.clone();

        thread::spawn(move || {
            while let Ok(txn) = rx.recv() {
                if let Ok(s) = serde_json::to_string(&txn) {
                    if out.send(s).is_err() {
                        break;
                    }
                }
                println!("[worker {}] converted {}", id, txn.transaction_id);
            }
            println!("[worker {}] exiting", id);
        });
    }

    drop(send_out);

    // Parse CSV
    let mut rdr = ReaderBuilder::new()
        .has_headers(true)
        .from_reader(csv_data);

    for result in rdr.deserialize::<Transaction>() {
        match result {
            Ok(record) => {
                if send_tx.send(record).is_err() {
                    break;
                }
            }
            Err(err) => {
                eprintln!("CSV parse error (skipping row): {}", err);
            }
        }
    }

    drop(send_tx);

    // Collect results
    let mut output = Vec::new();
    while let Ok(json_line) = recv_out.recv() {
        writeln!(output, "{}", json_line)?;
    }

    Ok(String::from_utf8(output)?)
}