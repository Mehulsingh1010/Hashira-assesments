use axum::{extract::{Path, Query}, Json};
use serde::{Deserialize, Serialize};
use crate::api::fetch_transactions;

#[derive(Deserialize)]
pub struct PaginationParams {
    #[serde(default = "default_page")]
    pub page: usize,
    #[serde(default = "default_page_size")]
    pub page_size: usize,
}

fn default_page() -> usize {
    1
}

fn default_page_size() -> usize {
    10
}

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
    pub timestamp: Option<String>,
}

#[derive(Serialize)]
pub struct PaginatedResponse {
    pub transactions: Vec<TransactionItem>,
    pub pagination: PaginationMeta,
}

#[derive(Serialize)]
pub struct PaginationMeta {
    pub current_page: usize,
    pub page_size: usize,
    pub total_items: usize,
    pub total_pages: usize,
    pub has_next: bool,
    pub has_prev: bool,
}

pub async fn get_transaction_history(
    Path(address): Path<String>,
    Query(params): Query<PaginationParams>,
) -> Json<PaginatedResponse> {
    let txs = fetch_transactions(&address).await.unwrap_or_default();

    let total_items = txs.len();
    let total_pages = (total_items as f64 / params.page_size as f64).ceil() as usize;
    let current_page = params.page.max(1).min(total_pages.max(1));
    
    let start_idx = (current_page - 1) * params.page_size;
    let end_idx = (start_idx + params.page_size).min(total_items);
    
    let paginated_txs = if start_idx < total_items {
        &txs[start_idx..end_idx]
    } else {
        &[]
    };
    
    let history: Vec<TransactionItem> = paginated_txs
        .iter()
        .map(|t| TransactionItem {
            hash: t.hash.clone(),
            from: t.from.clone(),
            to: t.to.clone(),
            value: t.value.clone(),
            timestamp: t.timestamp.clone(),
        })
        .collect();
    
    Json(PaginatedResponse {
        transactions: history,
        pagination: PaginationMeta {
            current_page,
            page_size: params.page_size,
            total_items,
            total_pages,
            has_next: current_page < total_pages,
            has_prev: current_page > 1,
        },
    })
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