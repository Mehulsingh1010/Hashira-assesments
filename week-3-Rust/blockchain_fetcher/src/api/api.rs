use crate::models::Transaction;
use serde::Deserialize;
use std::env;

#[derive(Deserialize)]
pub struct ApiResponse {
    status: String,
    result: Vec<Transaction>,
}

pub async fn fetch_transactions(address: &str) -> Result<Vec<Transaction>, String> {
    let api_key = env::var("ETHERSCAN_API_KEY")
        .map_err(|_| "api key not found".to_string())?;

    let url = format!(
        "https://api.etherscan.io/v2/api?chainid=1&module=account&action=txlist&address={}&apikey={}",
        address, api_key
    );

    let res = reqwest::get(&url)
        .await
        .map_err(|e| format!("Network error: {}", e))?;

    if !res.status().is_success() {
        return Err(format!("HTTP Error: {}", res.status()));
    }

    let api: ApiResponse = res
        .json()
        .await
        .map_err(|e| format!("JSON Parse Error: {}", e))?;

    if api.status != "1" {
        return Ok(vec![]);
    }

    Ok(api.result)
}
