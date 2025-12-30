use crate::db_trait::Database;
use async_trait::async_trait;
use rocksdb::{DB, Options};
use std::error::Error;
use std::path::Path;
use std::time::{Duration, Instant};

pub struct RocksDBImpl {
    db: Option<DB>,
    path: String,
}

impl RocksDBImpl {
    pub fn new() -> Self {
        Self {
            db: None,
            path: "rocksdb_raw_data".to_string(),
        }
    }
}

#[async_trait]
impl Database for RocksDBImpl {
    async fn init(&mut self) -> Result<(), Box<dyn Error + Send + Sync>> {
        let path = Path::new(&self.path);
        if path.exists() {
            std::fs::remove_dir_all(path)?;
        }

        let mut opts = Options::default();
        opts.create_if_missing(true);
        opts.increase_parallelism(num_cpus::get_physical() as i32);

        let db = DB::open(&opts, &self.path)?;
        self.db = Some(db);
        Ok(())
    }

    async fn create(&mut self, key: &str, value: &str) -> Result<Duration, Box<dyn Error + Send + Sync>> {
        let start = Instant::now();
        let db = self.db.as_ref().unwrap();
        db.put(key.as_bytes(), value.as_bytes())?;
        Ok(start.elapsed())
    }

    async fn read(&self, key: &str) -> Result<Option<String>, Box<dyn Error + Send + Sync>> {
        let db = self.db.as_ref().unwrap();
        match db.get(key.as_bytes())? {
            Some(bytes) => Ok(Some(String::from_utf8_lossy(&bytes).to_string())),
            None => Ok(None),
        }
    }

    async fn update(&mut self, key: &str, value: &str) -> Result<Duration, Box<dyn Error + Send + Sync>> {
        let start = Instant::now();
        let db = self.db.as_ref().unwrap();
        db.put(key.as_bytes(), value.as_bytes())?;  // overwrites
        Ok(start.elapsed())
    }

    async fn delete(&mut self, key: &str) -> Result<Duration, Box<dyn Error + Send + Sync>> {
        let start = Instant::now();
        let db = self.db.as_ref().unwrap();
        db.delete(key.as_bytes())?;
        Ok(start.elapsed())
    }

    async fn cleanup(&mut self) -> Result<(), Box<dyn Error + Send + Sync>> {
        self.db = None;
        let path = Path::new(&self.path);
        if path.exists() {
            std::fs::remove_dir_all(path)?;
        }
        Ok(())
    }
}