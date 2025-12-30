use std::fs;
use std::time::Instant;
use serde::Serialize;
use serde_json;
use tokio;

mod db_trait;
mod utils;
mod surrealdb_impl;
mod postgres_impl;
mod mongo_impl;

use db_trait::Database;
use utils::{generate_key, generate_value};

#[derive(Serialize, Default)]
struct DbResult {
    create_avg_ms: f64,
    read_avg_ms: f64,
    update_avg_ms: f64,
    delete_avg_ms: f64,
    ops: usize,
}

#[derive(Serialize)]
struct Results {
    surrealdb: DbResult,
    postgres: DbResult,
    mongodb: DbResult,
}

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    fs::create_dir_all("results")?;

    let num_ops = 5000;
    let value_size = 256;

    let results = Results {
        surrealdb: benchmark("SurrealDB", Box::new(surrealdb_impl::SurrealDBImpl::new()) as Box<dyn Database>, num_ops, value_size).await,
        postgres: benchmark("PostgreSQL", Box::new(postgres_impl::PostgresImpl::new()) as Box<dyn Database>, num_ops, value_size).await,
        mongodb: benchmark("MongoDB", Box::new(mongo_impl::MongoImpl::new()) as Box<dyn Database>, num_ops, value_size).await,
    };

    let json = serde_json::to_string_pretty(&results)?;
    fs::write("results/benchmark_results.json", &json)?;
    println!("Benchmark complete!\n{}", json);

    Ok(())
}

async fn benchmark(name: &str, mut db: Box<dyn Database>, num_ops: usize, value_size: usize) -> DbResult {
    println!("Starting {} benchmark...", name);
    db.init().await.expect("Init failed");

    let mut create = vec![];
    let mut read = vec![];
    let mut update = vec![];
    let mut delete = vec![];

    for i in 0..num_ops {
        let key = generate_key(i);
        let value = generate_value(value_size);

        let start = Instant::now();
        db.create(&key, &value).await.unwrap();
        create.push(start.elapsed());

        let start = Instant::now();
        db.read(&key).await.unwrap();
        read.push(start.elapsed());

        let start = Instant::now();
        db.update(&key, &value).await.unwrap();
        update.push(start.elapsed());

        let start = Instant::now();
        db.delete(&key).await.unwrap();
        delete.push(start.elapsed());
    }

    db.cleanup().await.unwrap();

    let avg = |v: &[std::time::Duration]| v.iter().map(|d| d.as_secs_f64() * 1000.0).sum::<f64>() / v.len() as f64;

    DbResult {
        create_avg_ms: avg(&create),
        read_avg_ms: avg(&read),
        update_avg_ms: avg(&update),
        delete_avg_ms: avg(&delete),
        ops: num_ops,
    }
}