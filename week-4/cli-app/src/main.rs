use std::env; //helps to unfold environment variables if any
use std::fs; //helps to import things from other files or read it
use std::process; //helps to execute program without panicking
use std::error::Error;
use rayon::prelude::*; //parallel iterator trait for multi-threading support

fn main() {
    //ARGS GIVES US ITERATOR THAT PASSES THROUGH OUR PROGRAM AND COLLECT TURNS ITERATOR INTO A COLLECTION
    let args: Vec<String> = env::args().collect();
    //if we print without anything it simply gives one argument, path to binary
    
    let config = Config::new(&args).unwrap_or_else(|err| {
        eprintln!("Problem parsing argument: {}", err);
        process::exit(1); //changed from 0 to 1 to indicate error exit code
    });
    
    println!("Searching for: {}", config.query);
    println!("In file: {}", config.filename);

    if let Err(e) = run(config) {
        eprintln!("Application error: {}", e);
        process::exit(1); //exit with error code on application failure
    }
}

//main execution function that reads file and performs search based on configuration
fn run(config: Config) -> Result<(), Box<dyn Error>> {
    let contents = fs::read_to_string(config.filename)?;

    //dispatch to appropriate search function based on case sensitivity flag
    let results = if config.case_sensitive {
        search(&config.query, &contents)
    } else {
        search_case_insensitive(&config.query, &contents)
    };

    //print each matching line to stdout
    for line in results {
        println!("{}", line);
    }

    Ok(())
}

//configuration struct that holds search parameters
struct Config {
    query: String,      //the search term to look for
    filename: String,   //the file to search in
    case_sensitive: bool, //whether to perform case-sensitive search
}

impl Config {
    //constructor that validates and creates Config from command-line arguments
    fn new(args: &[String]) -> Result<Config, &str> {
        if args.len() < 3 {
            return Err("not enough arguments to fuel CLI");
        }

        let query = args[1].clone();
        //not too efficient since we are using clones but in next chapter we will look at how to handle lifetimes more efficiently

        let filename = args[2].clone();

        //check environment variable to determine case sensitivity
        //if CASE_INSENSITIVE is NOT set (is_err), then we do case-sensitive search
        let case_sensitive = env::var("CASE_INSENSITIVE").is_err();

        Ok(Config {
            query,
            filename,
            case_sensitive,
        })
    }
}                           

//MULTI-THREADED case-insensitive search using rayon's parallel iterators
//splits work across multiple CPU cores for faster processing on large files
pub fn search_case_insensitive<'a>(query: &str, contents: &'a str) -> Vec<&'a str> {
    let query = query.to_lowercase(); //convert query to lowercase once for comparison

    //par_lines() creates parallel iterator that distributes lines across thread pool
    contents
        .par_lines() //parallel iterator over lines
        .filter(|line| line.to_lowercase().contains(&query)) //filter lines that match query
        .collect() //collect results back into Vec
}

//MULTI-THREADED case-sensitive search using rayon's parallel iterators
//automatically balances workload across available CPU threads
pub fn search<'a>(query: &str, contents: &'a str) -> Vec<&'a str> {
    //rayon automatically chunks the lines and processes them in parallel
    contents
        .par_lines() //creates parallel iterator over lines
        .filter(|line| line.contains(query)) //keep only lines containing the query
        .collect() //gather filtered results into Vec
}

#[cfg(test)]
mod tests {
    use super::*;

    //test case-sensitive search to ensure exact matches work correctly
    #[test]
    fn case_sensitive() {
        let query = "duct";
        let contents = "\
Rust:
safe, fast, productive.
Pick three.
Duct tape.";

        assert_eq!(vec!["safe, fast, productive."], search(query, contents));
    }

    //test case-insensitive search to ensure it matches regardless of letter casing
    #[test]
    fn case_insensitive() {
        let query = "rUsT";
        let contents = "\
Rust:
safe, fast, productive.
Pick three.
Trust me.";

        assert_eq!(
            vec!["Rust:", "Trust me."],
            search_case_insensitive(query, contents)
        );
    }

    //test parallel search with large dataset to verify multi-threading correctness
    #[test]
    fn parallel_search_large_dataset() {
        let query = "test";
        //create large content with repeated patterns
        let contents = (0..10000)
            .map(|i| format!("line {} with test data", i))
            .collect::<Vec<_>>()
            .join("\n");

        let results = search(query, &contents);
        //should find 10000 matches since every line contains "test"
        assert_eq!(results.len(), 10000);
    }

    //test that multi-threaded search produces same results as single-threaded
    #[test]
    fn parallel_consistency() {
        let query = "Rust";
        let contents = "\
Rust is fast.
Python is slow.
Rust is memory safe.
Java uses garbage collection.
Rust has zero-cost abstractions.";

        let results = search(query, contents);
        assert_eq!(results.len(), 3); //should find 3 lines with "Rust"
    }
}