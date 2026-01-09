use crate::db_traits::db_trait::Database;
use async_trait::async_trait;
use mongodb::{Client, bson::doc};
use std::time::{Duration, Instant};
use std::error::Error;

pub struct MongoImpl {
    client: Option<Client>,
    db: Option<mongodb::Database>,
}

impl MongoImpl {
    pub fn new()->Self{
        Self{client:None,db:None}
    }
}

#[async_trait]
impl Database for MongoImpl {
    async fn init(&mut self) -> Result<(), Box<dyn Error + Send + Sync>> {
        let client = Client::with_uri_str("mongodb://benchuser:benchpass@localhost:27017").await?;
        let db = client.database("benchdb");
        self.client = Some(client);
        self.db = Some(db);
        Ok(())
    }

    async fn create(&mut self, key: &str, value: &str) -> Result<Duration, Box<dyn Error + Send + Sync>> {
        let start = Instant::now();
        let db = self.db.as_ref().ok_or("Database not initialized. Call init() first")?;
        let coll: mongodb::Collection<mongodb::bson::Document> = db.collection::<mongodb::bson::Document>("kv");
        coll.update_one(
            doc! { "_id": key },
            doc! { "$set": { "value": value } },
        )
        .upsert(true)
        .await?;
        Ok(start.elapsed())
    }

    async fn read(&self, key: &str) -> Result<Option<String>, Box<dyn Error + Send + Sync>> {
        let db = self.db.as_ref().ok_or("Database not initialized. Call init() first")?;
        let coll = db.collection::<mongodb::bson::Document>("kv");
        let result = coll.find_one(doc! { "_id": key }).await?;
        Ok(result.and_then(|doc| doc.get_str("value").ok().map(|s| s.to_string())))
    }

    async fn update(&mut self, key: &str, value: &str) -> Result<Duration, Box<dyn Error + Send + Sync>> {
        self.create(key, value).await
    }

    async fn delete(&mut self, key: &str) -> Result<Duration, Box<dyn Error + Send + Sync>> {
        let start = Instant::now();
        let db = self.db.as_ref().ok_or("Database not initialized. Call init() first")?;
        let coll = db.collection::<mongodb::bson::Document>("kv");
        coll.delete_one(doc! { "_id": key }).await?;
        Ok(start.elapsed())
    }

    async fn cleanup(&mut self) -> Result<(), Box<dyn Error + Send + Sync>> {
        if let Some(db) = &self.db {
            db.collection::<mongodb::bson::Document>("kv").drop().await?;
        }
        self.client = None;
        self.db = None;
        Ok(())
    }
}
