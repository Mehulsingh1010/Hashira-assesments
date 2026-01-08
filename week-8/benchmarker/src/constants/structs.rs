use serde::Serialize;

#[derive(Serialize, Default)]
pub struct DbResult {
    pub create_avg_sec: f64,
    pub create_total_sec: f64,
    pub read_avg_sec: f64,
    pub read_total_sec: f64,
    pub update_avg_sec: f64,
    pub update_total_sec: f64,
    pub delete_avg_sec: f64,
    pub delete_total_sec: f64,
    pub ops: usize,
}

#[derive(Serialize)]
pub struct Winner {
    pub database: String,
    pub time_sec: f64,
}

#[derive(Serialize)]
pub struct Conclusions {
    pub fastest_create: Winner,
    pub fastest_read: Winner,
    pub fastest_update: Winner,
    pub fastest_delete: Winner,
    pub overall_fastest: Winner,
}

#[derive(Serialize)]
pub struct Results {
    pub surrealdb: DbResult,
    pub postgres: DbResult,
    pub mongodb: DbResult,
    pub rocksdb_raw: DbResult,
    pub conclusions: Conclusions,
}

    pub const NUM_OPS: usize = 5000;
    pub const VALUE_SIZE: usize = 256;