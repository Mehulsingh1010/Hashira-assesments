use axum::{extract::Path, Json};
use serde::Serialize;
use crate::api::fetch_transactions;

#[derive(Serialize)]
pub struct WalletReport {
    pub total_in: f64,
    pub total_out: f64,
    pub net_change: f64,
    pub tx_count: usize,
}

#[derive(Serialize)]
pub struct TransactionItem {
    pub hash: String,
    pub from: String,
    pub to: Option<String>,
    pub value: String,
}

pub async fn get_transaction_history(
    Path(address): Path<String>
) -> Json<Vec<TransactionItem>> {
    let txs = fetch_transactions(&address).await.unwrap_or_default();

    let history = txs
        .into_iter()
        .map(|t| TransactionItem {
            hash: t.hash,
            from: t.from,
            to: t.to,
            value: t.value,
        })
        .collect();

    Json(history)
}

pub async fn get_wallet_report(
    Path(address): Path<String>
) -> Json<WalletReport> {
    let address_lower = address.to_lowercase();
    let txs = fetch_transactions(&address).await.unwrap_or_default();

    let mut total_in = 0.0;
    let mut total_out = 0.0;

    for tx in &txs {
        let amount = tx.value.parse::<f64>().unwrap_or(0.0);

        if tx.to.as_deref().unwrap_or("").to_lowercase() == address_lower {
            total_in += amount;
        } else if tx.from.to_lowercase() == address_lower {
            total_out += amount;
        }
    }

    Json(WalletReport {
        total_in,
        total_out,
        net_change: total_in - total_out,
        tx_count: txs.len(),
    })
}
