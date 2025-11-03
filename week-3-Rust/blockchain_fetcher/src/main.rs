mod api;
mod models;

use api::fetch_transactions;
use std::env;

#[tokio::main]
async fn main() {
    dotenv::dotenv().ok();

    let address = env::var("WALLET_ADDRESS").expect("WALLET_ADDRESS not set");
    let address_lower = address.to_lowercase();

    println!("Fetching transactions for address: {}", address);

    match fetch_transactions(&address).await {
        Ok(txs) => {
            println!("✅ Successfully fetched {} transactions.", txs.len());
            println!("note that : 1 ETH= 10**18 Wei ");

            let mut total_in: f64 = 0.0;
            let mut total_out: f64 = 0.0;

            for tx in &txs {
                let value_raw = tx.value.parse::<f64>().unwrap_or(0.0);
                let from_lower = tx.from.to_lowercase();
                let to_lower = tx.to.clone().unwrap_or_default().to_lowercase();

                if to_lower == address_lower {
                    total_in += value_raw;
                } else if from_lower == address_lower {
                    total_out += value_raw;
                }
            }

            println!("\n💰 Total Received (raw Wei): {}", total_in);
            println!("💸 Total Sent (raw Wei): {}", total_out);
            println!(
                "📊 Net Balance Change (raw Wei): {}",
                total_in - total_out
            );
        }
        Err(err) => eprintln!("❌ Error: {}", err),
    }
}
