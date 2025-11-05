use serde::{Deserialize, Serialize};

#[derive(Debug, Deserialize, Serialize, Clone)]
pub struct Transaction {
    pub hash: String,
    pub from: String,
    pub to: Option<String>,
    pub value: String,
    #[serde(rename = "timeStamp")]
    pub timestamp: Option<String>,
}