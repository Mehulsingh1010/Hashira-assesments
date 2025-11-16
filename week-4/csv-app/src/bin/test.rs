use clap::{Command, Arg};

fn main() {
    let matches = Command::new("myapp")
        .arg(
            Arg::new("firstname")
                .short('f')
                .long("firstname")
                .required(false)
                .help("Your first name"),
        )
        .arg(
            Arg::new("lastname")
                .short('l')
                .long("lastname")
                .required(false)
                .help("Your last name"),
        )
        .get_matches();

    let first = matches.get_one::<String>("firstname");
    let last = matches.get_one::<String>("lastname");

    println!("First: {:?}", first);
    println!("Last : {:?}", last);
}
