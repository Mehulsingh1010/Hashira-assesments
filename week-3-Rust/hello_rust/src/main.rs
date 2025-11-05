// use std::io;
// use rand::{rng, Rng};
// use serde::Serialize;


fn main() {
    //number data types in rust

    // let mut num :u16=5222;
    // println!("Hello, world! This is my first rust program. The number is {}",num);
    // num=1;
    // println!("This is stored in num {} ",num);

    //string  data types in rust: &str fixed length string , string_literal is dynamic string data type which is mutable , this is  --default--
    // let mut string_literal:String=String::from("hello ");
    // string_literal.push_str("how are you");
    // println!("{}",string_literal);

    //tuple data type in rust
    // let stud_info:(&str,u8)=("Mehul",21);
    // let emp_name=stud_info.0;
    // let emp_age=stud_info.1;
    //or

    // let (emp_name,emp_age)=stud_info;
    // println!("The name of the student is {} and age is {}",emp_name,emp_age);


    //functions in rust

    // print_val(3);

    // let num1:u8=10;
    // let num2:u8=10;
    // add(num1,num2);



    //memory management in rust : ownership , borrowing , slices , lifetimes
    //two types of data in rust : stack data and heap data
    //stack data : fixed size data types : integers , floats , booleans , characters , tuples (if they contain fixed size data types)
    //heap data : dynamic size data types : strings , vectors , tuples (if they contain dynamic size data types)

    // let num1=5;
    // let num2=num1;
    // println!("num1 is {} and num2 is {}",num1,num2);
    //can be coppied because they are being stored in stacks
    // let str1=String::from("hello");
    // let str2=str1;
    // println!("str1 is {} and str2 is {}",str1,str2);
    //cannot be coppied because they are being stored in heaps and rust by default moves the ownership of heap data types



    //user input in Rust
    // use std::io;
    // println!("Enter your name: ");
    // let mut name=String::new();
    // io::stdin().read_line(&mut name).expect("Failed to read line"); 
    // println!("Hello, {}",name);


    // guess game
    //  let fruits = ["apple", "mango", "grapes", "peach"];
    // let mut rng = rng();

    // loop {
      
    //     let index = rng.random_range(0..fruits.len());
    //     let chosen_fruit = fruits[index];

    //     println!("Guess the fruit name:");

    //     let mut input = String::new();

    //     match io::stdin().read_line(&mut input) {
    //         Ok(_) => {
    //             let guess = input.trim().to_lowercase();

    //             if !fruits.contains(&guess.as_str()) {
    //                 println!("Invalid fruit. Try one from this list: {:?}", fruits);
    //                 continue;
    //             }

    //             if guess == chosen_fruit {
    //                 println!("You guessed it right!");

    //                 println!("Do you want to play again? (yes/no):");
    //                 let mut play_again = String::new();
    //                 io::stdin()
    //                     .read_line(&mut play_again)
    //                     .expect("Failed to read line");

    //                 if play_again.trim().to_lowercase() != "yes" {
    //                     println!("Thanks for playing!");
    //                     break;
    //                 }
    //             } else {
    //                 println!("Wrong guess. The correct fruit was '{}'.", chosen_fruit);
    //                 println!("Let's try another round.");
    //             }
    //         }
    //         Err(error) => {
    //             println!("Error reading input: {}", error);
    //         }
    //     }

    // println!("enums");

//     #[derive(Debug)]
//     enum Ip {
//         V4,
//         V6,
//     }

//     #[derive(Debug)]
//     struct IpAddr {
//         kind: Ip,
//         address: String,
//     }

//     let home = IpAddr {
//         kind: Ip::V4,
//         address: String::from("127.0.0.1"),
//     };

//     let loopback = IpAddr {
//         kind: Ip::V6,
//         address: String::from("::1"),
//     };



//   println!(" home : {:#?}",loopback);


    // #[derive(Debug)]
    //  enum IpAddr {
    //     V4(String),
    //     V6(String),
    // }

    // let home = IpAddr::V4(String::from("127.0.0.1"));


    // println!("{:#?}",home);

    //enumerate examples :

    // for (index, val) in ["a","b","c"].iter().enumerate(){
    //     println!("{}: {}",index,val);
    // }


    // loops in rust

    //1: Loop :
    // let mut count =0;

    // loop{
    //     count+=1;
    //     println!("Count = {}", count);

    //     if count==5 {
    //         println!("Running out after 5 scores");
    //         break;
    //     }
    // }

    //2: While loop
    // while count< 5{
    //     println!("count {}!",count);
    //     count+=1;
    // }
    // println!("done");

    //3: for loop

    // let numbers=[1,2,3,5];

    // for num in numbers.iter(){
    //     println!("The number is {}",num);
    // }

    //these dots represent bounds 
    // for i in 1..10 {
    //     if i == 3 {
    //         continue; 
    //     }
    //     if i == 7 {
    //         break; 
    //     }
    //     println!("i = {}", i);
    // }
    
// #[derive(Serialize, Debug)]
// struct User {
//     name: String,
//     age: u32,
//     active: bool,
// }

//     let user = User {
//         name: "Messi".to_string(),
//         age: 27,
//         active: true,
//     };

    // Serialize to JSON string
    // println!("Non Serialized JSON: {:?}", user);

    // let json_str = serde_json::to_string(&user).unwrap();

    // println!("Serialized JSON: {}",json_str);

    // let arr=[1,2,3,4,5];

    // let parts=&arr[1..=3];

    // println!("{:#?}",parts);


    // let mut v=vec![1,2,3,4];

    // v.push(8);

    // println!("The elements are as: {:#?}",v);
    // println!("The first element is: {}",&v[0]);

}


// fn print_val(item :u8){
//     println!("The vallue being passed from main is {}", item);
// }

// fn add(item1:u8, item2:u8){
//     let sum:u8=item1+item2;
//     println!("{}",sum);
// }

//snake_case is followed in rust generally for function and variable names
//CamelCase is followed for struct and enum names
//CONSTANT_CASE is followed for constants and statics


//so RUsT: hello_world (snake case), JS: helloWorld (camel case)