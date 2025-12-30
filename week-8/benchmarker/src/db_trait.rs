use async_trait::async_trait;
use std::time::Duration;
use std::error::Error;

#[async_trait]

pub trait Database {
async fn init(&mut self) -> Result<(), Box<dyn Error + Send + Sync>>;
    async fn create(&mut self, key: &str, value: &str) -> Result<Duration, Box<dyn Error + Send + Sync>>;
    async fn read(&self, key: &str) -> Result<Option<String>, Box<dyn Error + Send + Sync>>;
    async fn update(&mut self, key: &str, value: &str) -> Result<Duration, Box<dyn Error + Send + Sync>>;
    async fn delete(&mut self, key: &str) -> Result<Duration, Box<dyn Error + Send + Sync>>;
    async fn cleanup(&mut self) -> Result<(), Box<dyn Error + Send + Sync>>;
}