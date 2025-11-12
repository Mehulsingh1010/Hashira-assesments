use std::env; //helps to unfold envirnoment variables f any
use std::fs;//helps to import things from other files or readf it
use std::process; //helps to execute program without panicking
use std::error::Error;

fn main(){
//ARGS GIVES US ITERATOR THAT PASS THROUGGH OUR PROGRAM AND COLLECT TURNS ITERATOR INTO A COLLECTION
    let args:Vec<String> = env::args().collect();
    //if we print without anythingi it simply gives one argument, path to binary
    let config=Config::new(&args).unwrap_or_else(|err | {
        eprintln!("Problem running parsing argument : {}",err); 
        process::exit(0);
    });
    println!("Searching for{}",config.query);
    println!("In file {}",config.filename);

    
    if let Err(e) = run(config){
        eprintln!("Application erro : {}",e);
        
    }

}

fn run (config:Config)->Result<(),Box<dyn Error>>{
    let contents= fs::read_to_string(config.filename)?;
    

    let results= if config.case_sensitive{
        search(&config.query, &contents)
    }else{
        search_case_insensitive(&config.query, &contents)
    };


for line in results{
    println!("{}",line);
}

   
    Ok(())
}



struct Config{
    query:String,
    filename:String,
    case_sensitive:bool
}

impl Config{

fn new(args:&[String])->Result<Config,&str>{

    if args.len()<3{
        return Err("not enough arguments to fuel CLI")
        
    }

    let query =args[1].clone();
    //not too efiicient since we are using clones but in next chapter we will look at how to handle lifetimes more efficiently

    let filename=args[2].clone(); 

    let case_sensitive=env::var("CASE_INSENSITIVE").is_err();

    Ok(Config{query,filename,case_sensitive})  
    
}

}

pub fn search_case_insensitive<'a>(
    query: &str,
    contents:&'a str
)->Vec<&'a str> {
    let query=query.to_lowercase();
    let mut results=Vec::new();

    for line in contents.lines(){
        if line.to_lowercase().contains(&query){
            results.push(line);
        }
    }
    results
}

pub fn search<'a>(query: &str, contents:&'a str)->Vec<&'a str>{
    let mut results=Vec::new();
    for line in contents.lines(){
        if line.contains(query){
            results.push(line);
        }
    }
    results
}








#[cfg(test)]
mod tests{
    use minigrep::search;

    use super::*;
     
    #[test]
    fn case_sensitive(){
        let query ="duct";
        let contents="\
Rust:
safe, fast, productive.
Pick three.
Duct tape.";

        assert_eq!(vec!["safe, fast, productive."],search(query, contents));
    } 

    #[test]
    fn case_insensitive(){
        let query="rUsT";
        let contents="\
Rust:
safe, fast, productive.
Pick three.
Trust me.";

        assert_eq!(
            vec!["Rust:","Trust me."],
            search_case_insensitive(query,contents)
        )
    }
}