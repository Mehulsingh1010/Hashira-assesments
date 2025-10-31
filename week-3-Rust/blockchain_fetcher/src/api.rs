use serde::Deserialize;
use std::env;

#[derive(Debug, Deserialize)]
pub struct Transaction {
    #[serde(rename = "hash")]
    pub hash: String,
    #[serde(rename = "from")]
    pub from: String,
    #[serde(rename = "to")]
    pub to: Option<String>,
    #[serde(rename = "value")]
    pub value: String,
}

#[derive(Debug, Deserialize)]
struct ApiResponse {
    status: String,
    message: String,
    result: serde_json::Value, 
}

pub async fn fetch_transactions(address: &str) -> Result<Vec<Transaction>, String> {
    dotenv::dotenv().ok();
    let api_key = env::var("ETHERSCAN_API_KEY")
        .map_err(|_| "Missing ETHERSCAN_API_KEY in .env".to_string())?;
    let url = format!(
        "https://api.etherscan.io/v2/api?chainid=1&module=account&action=txlist&address={}&apikey={}",
        address, api_key
    );

    let client = reqwest::Client::new();
    let res = client
        .get(&url)
        .send()
        .await
        .map_err(|e| format!("Network error: {}", e))?;

    let status = res.status();

    if !status.is_success() {
        return Err(format!("HTTP Error: {}", status));
    }

    let text = res.text().await.map_err(|e| format!("Error reading response: {}", e))?;
    println!("Raw response:\n{}\n", text);

    let api_response: ApiResponse = match serde_json::from_str(&text) {
        Ok(parsed) => parsed,
        Err(e) => return Err(format!("Failed to parse JSON response: {}", e)),
    };

    if api_response.status != "1" {
        println!("⚠️  API responded with: {}", api_response.message);
        return Ok(vec![]);
    }

    let transactions: Vec<Transaction> = match serde_json::from_value(api_response.result) {
        Ok(tx) => tx,
        Err(_) => vec![],
    };

    Ok(transactions)
}
