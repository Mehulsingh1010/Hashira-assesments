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
mod rocksdb_impl;  

use db_trait::Database;
use utils::{generate_key, generate_value};
use rocksdb_impl::RocksDBImpl;  

#[derive(Serialize, Default)]
struct DbResult {
    create_avg_ms: f64,
    create_total_ms: f64,
    read_avg_ms: f64,
    read_total_ms: f64,
    update_avg_ms: f64,
    update_total_ms: f64,
    delete_avg_ms: f64,
    delete_total_ms: f64,
    ops: usize,
}

#[derive(Serialize)]
struct Winner {
    database: String,
    time_ms: f64,
}

#[derive(Serialize)]
struct Conclusions {
    fastest_create: Winner,
    fastest_read: Winner,
    fastest_update: Winner,
    fastest_delete: Winner,
    overall_fastest: Winner,
}

#[derive(Serialize)]
struct Results {
    surrealdb: DbResult,
    postgres: DbResult,
    mongodb: DbResult,
    rocksdb_raw: DbResult,
    conclusions: Conclusions,
}

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    fs::create_dir_all("results")?;

    let num_ops = 5000;
    let value_size = 256;

    println!("Starting benchmarks with {} operations...", num_ops);

    let surrealdb_result = benchmark("SurrealDB", Box::new(surrealdb_impl::SurrealDBImpl::new()), num_ops, value_size).await;
    let postgres_result = benchmark("PostgreSQL", Box::new(postgres_impl::PostgresImpl::new()), num_ops, value_size).await;
    let mongodb_result = benchmark("MongoDB", Box::new(mongo_impl::MongoImpl::new()), num_ops, value_size).await;
    let rocksdb_result = benchmark("RocksDB", Box::new(RocksDBImpl::new()), num_ops, value_size).await;

    let conclusions = analyze_results(&[
        ("SurrealDB", &surrealdb_result),
        ("PostgreSQL", &postgres_result),
        ("MongoDB", &mongodb_result),
        ("RocksDB", &rocksdb_result),
    ]);

    let results = Results {
        surrealdb: surrealdb_result,
        postgres: postgres_result,
        mongodb: mongodb_result,
        rocksdb_raw: rocksdb_result,
        conclusions,
    };

    let json = serde_json::to_string_pretty(&results)?;
    fs::write("results/benchmark_results.json", &json)?;
    println!("Benchmark complete!\n{}", json);

    Ok(())
}

fn analyze_results(dbs: &[(&str, &DbResult)]) -> Conclusions {
    let find_fastest = |get_time: fn(&DbResult) -> f64| -> Winner {
        let mut fastest = dbs[0];
        let mut best_time = get_time(fastest.1);
        
        for &db in dbs.iter().skip(1) {
            let time = get_time(db.1);
            if time < best_time {
                best_time = time;
                fastest = db;
            }
        }
        
        Winner {
            database: fastest.0.to_string(),
            time_ms: best_time,
        }
    };

    let fastest_create = find_fastest(|r| r.create_avg_ms);
    let fastest_read = find_fastest(|r| r.read_avg_ms);
    let fastest_update = find_fastest(|r| r.update_avg_ms);
    let fastest_delete = find_fastest(|r| r.delete_avg_ms);
    
    // Overall fastest based on total time across all operations
    let overall_fastest = find_fastest(|r| {
        r.create_total_ms + r.read_total_ms + r.update_total_ms + r.delete_total_ms
    });

    Conclusions {
        fastest_create,
        fastest_read,
        fastest_update,
        fastest_delete,
        overall_fastest,
    }
}

async fn benchmark(name: &str, mut db: Box<dyn Database>, num_ops: usize, value_size: usize) -> DbResult {
    println!("Starting {} benchmark...", name);
    db.init().await.expect(&format!("{} init failed", name));

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
        let _ = db.read(&key).await.unwrap();  
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
    let total = |v: &[std::time::Duration]| v.iter().map(|d| d.as_secs_f64() * 1000.0).sum::<f64>();

    DbResult {
        create_avg_ms: avg(&create),
        create_total_ms: total(&create),
        read_avg_ms: avg(&read),
        read_total_ms: total(&read),
        update_avg_ms: avg(&update),
        update_total_ms: total(&update),
        delete_avg_ms: avg(&delete),
        delete_total_ms: total(&delete),
        ops: num_ops,
    }
}
