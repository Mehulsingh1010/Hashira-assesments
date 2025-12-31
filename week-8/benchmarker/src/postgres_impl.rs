use crate::db_trait::Database;
use async_trait::async_trait;
use sqlx::PgPool;
use std::time::{Duration, Instant};
use std::error::Error;

pub struct PostgresImpl {
    pool: Option<PgPool>,
}

impl PostgresImpl {
    pub fn new() -> Self {
        Self { pool: None }
    }
}

#[async_trait]
impl Database for PostgresImpl {
    async fn init(&mut self) -> Result<(), Box<dyn Error + Send + Sync>> {
        let pool = PgPool::connect("postgres://benchuser:benchpass@localhost:5432/benchdb").await?;
        sqlx::query("CREATE TABLE IF NOT EXISTS kv (key TEXT PRIMARY KEY, value TEXT)").execute(&pool).await?;
        self.pool = Some(pool);
        Ok(())
    }

    async fn create(&mut self, key: &str, value: &str) -> Result<Duration, Box<dyn Error + Send + Sync>> {
        let start = Instant::now();
        sqlx::query("INSERT INTO kv (key, value) VALUES ($1, $2) ON CONFLICT (key) DO UPDATE SET value = $2")
            .bind(key)
            .bind(value)
            .execute(self.pool.as_ref().unwrap())
            .await?;
        Ok(start.elapsed())
    }

    async fn read(&self, key: &str) -> Result<Option<String>, Box<dyn Error + Send + Sync>> {
        let row: Option<(String,)> = sqlx::query_as("SELECT value FROM kv WHERE key = $1")
            .bind(key)
            .fetch_optional(self.pool.as_ref().unwrap())
            .await?;
        Ok(row.map(|r| r.0))
    }

    async fn update(&mut self, key: &str, value: &str) -> Result<Duration, Box<dyn Error + Send + Sync>> {
        self.create(key, value).await
    }

    async fn delete(&mut self, key: &str) -> Result<Duration, Box<dyn Error + Send + Sync>> {
        let start = Instant::now();
        sqlx::query("DELETE FROM kv WHERE key = $1")
            .bind(key)
            .execute(self.pool.as_ref().unwrap())
            .await?;
        Ok(start.elapsed())
    }

    async fn cleanup(&mut self) -> Result<(), Box<dyn Error + Send + Sync>> {
        if let Some(pool) = &self.pool {
            sqlx::query("DROP TABLE kv").execute(pool).await?;
        }
        self.pool = None;
        Ok(())
    }
}
