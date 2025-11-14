use std::env;
use std::error::Error;
use std::fs;
use std::os::windows::thread;
use std::process;
use std::thread::JoinHandle;
use std::thread::spawn;
fn main(){

    // let args:Vec<String>=env::args().collect();
    // println!("{:?}",args);
    // let config=Config::new(&args);

    // println!("Searching for {}",config.query);
    // println!("In file {}", config.filename);
    // run(config);
   
    // let a=3;
    // let mult=|x,y| y+x+3;
    // print!("{}",mult(4,3));


    // let add= |a:i32, b:i32| a + b;

    // println!("{}", add(2,3))

    // let nums= vec![1,2,3];
    // for n in nums.iter(){
    //     println!("{}",n);
    // }

    // let v1:Vec<i32> =vec![1,2,3];
    // for i in v1.iter(){
    //     print!("{}",i);
    // }

    // let v2:Vec<_> =v1.iter().map(|x: &i32|x+1).collect();
    
    // assert_eq!(v2,vec![2,3,4]);

    // let mut b=Box::new(5);
    // println!("b={}",b);

    // *b=*b+1;
    // println!("{}",b);

    let handle = spawn_thread();
    handle.join().unwrap();
    println!("Thread fully finished!");


}

fn test_thread(){
    
    
}



pub fn spawn_thread() -> JoinHandle<()> {
    let thread_fn = || {
        let mut x: u128 = 0;
        println!("started");

        for i in 1..50_000_00000u128 {
            x += i;
        }

        println!("Sum = {}", x);
    };

    let handle = spawn(thread_fn);

    println!("finished spawning thread");

    handle     // <-- return thread handle
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

