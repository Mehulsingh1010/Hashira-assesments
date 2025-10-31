use serde::Deserialize;

#[derive(Debug, Deserialize)]
pub struct Transaction {
    pub hash: Option<String>,
    pub from: Option<String>,
    pub to: Option<String>,
    pub value: Option<String>,
    pub gas: Option<String>,
    pub gas_price: Option<String>,
    pub time_stamp: Option<String>,
}
