use crossbeam::channel;//for multiple channel multiple consumers
use csv::ReaderBuilder;//file reading for csv formats 
use std::fs::File;//for file creating or opening
use std::io::Write;//for writeln! macro to write file
use std::path::{Path, PathBuf}; //path reference to a pth(borrowed like &str)
use std::thread;//for the thread spawn utility (concurrency)
use clap::Parser;//importing parser that auto generate cli parsing

#[derive(Parser)]//tells clap to parse these arguments via cli and default value is provided
struct Args {
    /// Input CSV 
    // short : --i, long: --input, req:true then mandatory or else fail the request , num_args is number of inputs ( auto specified)
    #[arg(short, long, required = true, num_args = 1..)]
    input: Vec<String>,//array of inputs , can be singular too

    /// Output directory
    #[arg(short, long, default_value = "output")]
    output_dir: String,

    /// Worker threads
    #[arg(short, long, default_value_t = 4)]// t = typed so its referenced as a whole unlike the above &str 
    workers: usize,
}//automatically creates --help

fn main() -> anyhow::Result<()> {//entry point,return anyhow result either sucess or error 
    let args = Args::parse();//initiating args parse, reads from std env args, handles--help, returns populated Args struct
    
    std::fs::create_dir_all(&args.output_dir)?;//created folder for output )optional step)
    let (tx, rx) = channel::unbounded::<PathBuf>();//creates channel for sending file to workers , tx and rx are transmitter and reciever , unbounded for no queue msg limit

    // Spawn workers
    let handles: Vec<_> = (0..args.workers)//worker spawning part, vec type inferred automatically
        .map(|id| {// the whole thing {} runs for each worker .
            let rx = rx.clone();//clones the reciever for this worker, each thread needs its own handle to channel and clone creates new reference to the SAME channel 
            let out_dir = args.output_dir.clone();// clone the output directory path for this worker clone created owned coopy of the String needed bcz thread takes ownership and we cant share references
            thread::spawn(move || {//thread is spawned here, move takes ownership of rx out dir and id
                while let Ok(path) = rx.recv() {//to recieve the file and then rx blocks waitsuntil a msg arrives, returns Ok when file path recieved and returns Err whenc ahnnel is closed and empty
                    let out_path = Path::new(&out_dir).join(//creates path from string lik eouptut and join appends filename to directory , like output + data .jsonl = output/data.jsonl so its in the specific directory 
                        format!("{}.jsonl", path.file_stem().unwrap().to_str().unwrap())//takes filename withhotu extention then converts to string slice then adds jsonl extention result csv->json
                    );
                    match convert_csv(&path, &out_path) {
                        Ok(n) => println!("[Worker {}] [SUCCESS] {} → {} ({} rows)", id, path.display(), out_path.display(), n),
                        Err(e) => eprintln!("[Worker {}] [FAILED] {} - {}", id, path.display(), e),
                    }
                }
            })
        })
        .collect();//collects all threads into a vectorvec<joinhandle<()>>

    // Send jobs
    for file in args.input {
        tx.send(PathBuf::from(file))?;//send the path to worker viachannel convert string to PathBuf puts msg in channle and returns error also workerreciee thes eon the other end with rx recv
    }
    drop(tx);//desttroys variable

    // Wait for completion
    for h in handles {
        h.join().unwrap();//iteraete through all thread handles
    }

    println!(" [SUCCESS] Output: {}", args.output_dir);
    Ok(())
}
//
fn convert_csv(input: &Path, output: &Path) -> anyhow::Result<usize> {
    let mut rdr = ReaderBuilder::new().has_headers(true).from_path(input)?;
    let headers: Vec<_> = rdr.headers()?.iter().map(|h| h.to_string()).collect();
    let mut out = File::create(output)?;
    let mut count = 0;

    for record in rdr.records().flatten() {
        let json = headers.iter().zip(record.iter())
            .map(|(h, v)| format!("\"{}\":{}", h, serde_json::to_string(v).unwrap()))
            .collect::<Vec<_>>()
            .join(",");
        writeln!(out, "{{{}}}", json)?;
        count += 1;
    }

    Ok(count)
}