use crossbeam::channel;//for multiple channel multiple consumers
use csv::ReaderBuilder;//file reading for csv formats 
use std::fs::File;//for file creating or opening`
use std::io::Write;//for writeln! macro to write file`
use std::path::{Path, PathBuf}; use std::process::Output;
//path reference to a pth(borrowed like &str)
use std::thread;//for the thread spawn utility (concurrency)
use clap::Parser;


#[derive(Parser)]
struct Arguments{

    #[arg(short,long,required=true,num_args=1..)]
    input:Vec<String>,


    #[arg(short,long,default_value="output")]
    output_dir:String,

    #[arg(short,long,default_value_t=4)]
    worker:usize,

}


fn main()->anyhow::Result<()>{
    let arguments=Arguments::parse();

    std::fs::create_dir_all(&arguments.output_dir)?;

    let (tsx,rsx) = channel::unbounded::<PathBuf>();
    let handles:Vec<_>=(0..arguments.worker).map(|id| {
        let rsx=rsx.clone();
        let out_dir=arguments.output_dir.clone();
        thread::spawn(move || {
            while let Ok(path)=rsx.recv(){
                let out_path=Path::new(&out_dir).join(
                    format!("{}.jsonl",path.file_stem().unwrap().to_str().unwrap())
                    
                );
                match convert_csv(&path,&out_path){
                    Ok(_)=>{
                        println!("Worker {}: Converted {:?} to {:?}",id,path,out_path);
                    }
                    Err(e)=>{
                        eprintln!("Worker {}: Failed to convert {:?}: {}",id,path,e);
                    }
                }
            }
        })
    }).collect();

    







}

