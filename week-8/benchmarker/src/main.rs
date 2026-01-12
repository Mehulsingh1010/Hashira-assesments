use std::fs;
use std::time::Instant;
use std::time::Duration;
use serde_json;
use tokio;

mod db_traits;
mod database_impls;
mod constants;
use db_traits::db_trait::Database;
mod utils;
use database_impls::{MongoImpl, PostgresImpl, RocksDBImpl, SurrealDBImpl};
use constants::{DbResult, Winner, Conclusions, Results,VALUE_SIZE, NUM_OPS};

use utils::{generate_key, generate_value};


#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    fs::create_dir_all("results")?;



    println!("Starting benchmarks with {} operations...", NUM_OPS);

    let surrealdb_result = benchmark(
        "SurrealDB",
        Box::new(SurrealDBImpl::new()),
        NUM_OPS,
        VALUE_SIZE,
    )
    .await;

    let postgres_result = benchmark(
        "PostgreSQL",
        Box::new(PostgresImpl::new()),
        NUM_OPS,
        VALUE_SIZE,
    )
    .await;

    let mongodb_result = benchmark(
        "MongoDB",
        Box::new(MongoImpl::new()),
        NUM_OPS,
        VALUE_SIZE,
    )
    .await;

    let rocksdb_result = benchmark(
        "RocksDB",
        Box::new(RocksDBImpl::new()),
        NUM_OPS,
        VALUE_SIZE,
    )
    .await;

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
            time_sec: best_time,
        }
    };

    let fastest_create = find_fastest(|r| r.create_avg_sec);
    let fastest_read = find_fastest(|r| r.read_avg_sec);
    let fastest_update = find_fastest(|r| r.update_avg_sec);
    let fastest_delete = find_fastest(|r| r.delete_avg_sec);

    let overall_fastest = find_fastest(|r| {
        r.create_total_sec
            + r.read_total_sec
            + r.update_total_sec
            + r.delete_total_sec
    });

    Conclusions {
        fastest_create,
        fastest_read,
        fastest_update,
        fastest_delete,
        overall_fastest,
    }
}


async fn benchmark(
    name: &str,
    mut db: Box<dyn Database>,
    num_ops: usize,
    value_size: usize,
) -> DbResult {
    println!("Starting {} benchmark...", name);
    db.init().await.expect(&format!("{} init failed", name));

    let mut create = Vec::with_capacity(num_ops);
    let mut read = Vec::with_capacity(num_ops);
    let mut update = Vec::with_capacity(num_ops);
    let mut delete = Vec::with_capacity(num_ops);

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

    let avg = |v: &[Duration]| {
        v.iter().map(|d| d.as_secs_f64()).sum::<f64>() / v.len() as f64
    };  

    let total = |v: &[Duration]| {
        v.iter().map(|d| d.as_secs_f64()).sum::<f64>()
    };

    DbResult {
        create_avg_sec: avg(&create),
        create_total_sec: total(&create),
        read_avg_sec: avg(&read),
        read_total_sec: total(&read),
        update_avg_sec: avg(&update),
        update_total_sec: total(&update),
        delete_avg_sec: avg(&delete),
        delete_total_sec: total(&delete),
        ops: num_ops,
    }
}