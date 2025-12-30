use crate::db_trait::Database;
use async_trait::async_trait;
use serde::{Deserialize, Serialize};
use surrealdb::engine::local::{Db, Mem};
use surrealdb::Surreal;  // No need for Thing or RecordId import here
use std::error::Error;
use std::time::{Duration, Instant};

#[derive(Serialize)]
struct KvRecord {
    value: String,
}

// Add the id field for deserialization (it will be filled by SurrealDB)
#[derive(Deserialize, Debug)]
struct KvRecordWithId {
    id: surrealdb::RecordId,  // This is the correct type now
    value: String,
}

pub struct SurrealDBImpl {
    db: Option<Surreal<Db>>,
}

impl SurrealDBImpl {
    pub fn new() -> Self {
        Self { db: None }
    }
}

#[async_trait]
impl Database for SurrealDBImpl {
    async fn init(&mut self) -> Result<(), Box<dyn Error + Send + Sync>> {
        let db = Surreal::new::<Mem>(()).await?;
        db.use_ns("benchmark").use_db("benchmark").await?;
        self.db = Some(db);
        Ok(())
    }

    async fn create(&mut self, key: &str, value: &str) -> Result<Duration, Box<dyn Error + Send + Sync>> {
        let start = Instant::now();

        // Returns Option<KvRecordWithId> (the full record including generated id)
        let _: Option<KvRecordWithId> = self
            .db
            .as_ref()
            .unwrap()
            .create(("kv", key))
            .content(KvRecord { value: value.to_string() })
            .await?;

        Ok(start.elapsed())
    }

    async fn read(&self, key: &str) -> Result<Option<String>, Box<dyn Error + Send + Sync>> {
        // Directly deserialize into the full record
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

        // Returns Option<KvRecordWithId> (updated record with id)
        let _: Option<KvRecordWithId> = self
            .db
            .as_ref()
            .unwrap()
            .update(("kv", key))
            .content(KvRecord { value: value.to_string() })
            .await?;

        Ok(start.elapsed())
    }

    async fn delete(&mut self, key: &str) -> Result<Duration, Box<dyn Error + Send + Sync>> {
        let start = Instant::now();

        // delete returns Option<KvRecordWithId> (the deleted record, if existed)
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