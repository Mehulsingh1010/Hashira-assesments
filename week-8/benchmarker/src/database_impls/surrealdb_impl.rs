use crate::db_traits::db_trait::Database;
use async_trait::async_trait;
use serde::{Deserialize, Serialize};
use surrealdb::engine::remote::ws::Client;  
use surrealdb::opt::auth::Root;             
use surrealdb::Surreal;
use std::error::Error;
use std::time::{Duration, Instant};

#[derive(Serialize)]
struct KvRecord {
    value: String,
}

#[derive(Deserialize, Debug)]
struct KvRecordWithId {
    value: String,
}

pub struct SurrealDBImpl {
    db: Option<Surreal<Client>>,
}

impl SurrealDBImpl {
    pub fn new() -> Self {
        Self { db: None }
    }
}

#[async_trait]
impl Database for SurrealDBImpl {
    async fn init(&mut self) -> Result<(), Box<dyn Error + Send + Sync>> {
        let db = Surreal::new::<surrealdb::engine::remote::ws::Ws>("127.0.0.1:8000").await?;

        db.signin(Root {
            username: "root",
            password: "root",
        })
        .await?;

        db.use_ns("benchmark").use_db("benchmark").await?;

        self.db = Some(db);
        Ok(())
    }

    async fn create(&mut self, key: &str, value: &str) -> Result<Duration, Box<dyn Error + Send + Sync>> {
        let start = Instant::now();

        let _: Option<KvRecordWithId> = self
            .db
            .as_ref()
            .unwrap()
            .create(("kv", key))
            .content(KvRecord {
                value: value.to_string(),
            })
            .await?;

        Ok(start.elapsed())
    }

    async fn read(&self, key: &str) -> Result<Option<String>, Box<dyn Error + Send + Sync>> {
        let result: Option<KvRecordWithId> = self
            .db
            .as_ref()
            .unwrap()
            .select(("kv", key))
            .await?;

        Ok(result.map(|r| r.value))
    }

    async fn update(&mut self, key: &str, value: &str) -> Result<Duration, Box<dyn Error + Send + Sync>> {
        let start = Instant::now();

        let _: Option<KvRecordWithId> = self
            .db
            .as_ref()
            .unwrap()
            .update(("kv", key))
            .content(KvRecord {
                value: value.to_string(),
            })
            .await?;

        Ok(start.elapsed())
    }

    async fn delete(&mut self, key: &str) -> Result<Duration, Box<dyn Error + Send + Sync>> {
        let start = Instant::now();

        let _: Option<KvRecordWithId> = self
            .db
            .as_ref()
            .unwrap()
            .delete(("kv", key))
            .await?;

        Ok(start.elapsed())
    }

    async fn cleanup(&mut self) -> Result<(), Box<dyn Error + Send + Sync>> {
        self.db = None;
        Ok(())
    }
}