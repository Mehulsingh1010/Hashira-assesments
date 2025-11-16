use crossbeam::channel;
use csv::ReaderBuilder;
use serde::{Deserialize,Serialize};
use std::fs::File;
use std::io::Write;
use std::thread;
use clap::Parser;


#[derive(Debug,Deserialize,Serialize)]
struct Transaction{
    transaction_id:String,
    category:String,
    amount:f64,
    currency:String,
    desciption :String
}

#[derive(Parser,Debug)]

struct Args{
    #[arg(short,long,default_value="data.csv")]
    input:String,

    #[arg(short,long,default_value="output.json")]
    output:String,

    #[arg(short,long , default_value_t=4)]
    worker:usize
}


fn main()->anyhow::Result<()>{
    let args=Args::parse();
    
    println!("Starting conversion...");
    println!("Input : {}",args.input);
    println!("Output: {}",args.output);
    println!("Workers : {}",args.worker);

    let (send_tx, revc_tsx)=channel::unbounded::<Transaction>();
    let (send_out, recv_out)=channel::unbounded::<String>();

    for id in 0..args.worker{
        let rx=revc_tsx.clone();
        let out=send_out.clone();

        thread::spawn(move || {
            while let Ok(txn)=rx.recv(){
                if let Ok(s)=serde_json::to_string(&txn){
                    if out.send(s).is_err(){
                        break;
                    }
                }

                println!("[worker{}] converted {}",id,txn.transaction_id);
            }
            println!("[worker {}] exiting", id);
        });
    }

    drop(send_out);

    let mut rdr=ReaderBuilder::new().has_headers(true).from_path(&args.input)?;
    for result in rdr.deserialize::<Transaction>(){
        match result{
            Ok(record)=>{
                if send_tx.send(record).is_err(){
                    break;
                }
            }

            Err(err)=>{
                eprintln!("Csv parse error ( skiping rows) : {} ",err);
            }
        }

    }

    drop(send_tx);

    let mut out_file=File::create(&args.output)?;

    while let Ok(json_line)= recv_out.recv(){
        writeln!(out_file, "{}", json_line)?;
   

 }
    println!("Conversion complete -> {}",args.output);
    
    Ok(())

 

}
