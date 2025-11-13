use std::env;
use std::error::Error;
use std::fs;
use std::process;

fn main(){

    // let args:Vec<String>=env::args().collect();
    // println!("{:?}",args);
    // let config=Config::new(&args);

    // println!("Searching for {}",config.query);
    // println!("In file {}", config.filename);
    // run(config);
   
    let a=3;
    let mult=|x,y| y+x+3;
    print!("{}",mult(4,3));


    let add= |a:i32, b:i32| a + b;

    println!("{}", add(2,3))

    

}

fn run (config:Config)->Result<(), Box<dyn Error>>{
     let contents=fs::read_to_string(config.filename)?;
    println!("the text : {}",contents);
    Ok(())
}


impl Config{
fn new(args:&[String])->Config{
    if args.len() < 3{
        panic!("not enough argument")
    }
    let query=args[1].clone();
    let filename=args[2].clone();

    Config { query ,  filename }
}
}
struct Config{
    query:String,
    filename:String
}

