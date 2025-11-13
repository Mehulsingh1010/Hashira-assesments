// use core::{error, num};
// use std::{fs::File, io::{self, Read}};

// use serde::de::value::Error;

// fn main(){
// //    let Ff=File::open("hello.txt");
// let num_list=[1,55,4,3,77,6];
// let mut minnum=num_list[0];

// for num in num_list{
//     if(num<minnum){
//         minnum=num;
//     }
// }
//     println!("The smallest num is {}",minnum);
// }

// fn max_finder<T: PartialOrd + Copy>(num_list:Vec<T>)-> T{
//     let mut minnum=num_list[0];
//     for num in num_list{
//     if(num<minnum){
//         minnum=num;
//     }
// }
// return minnum
// }

// struct pointers<T>{
//     x:T,
//     y:T
// }

// fn auto_div(a:i32,b:i32) ->Result<i32,String>{
//     if b==0{
//         Err("Cannot div by 0".to_owned())
//     }else{
//         Ok(a/b)
//     }
// }

// fn read_from_file() -> Result<String, io::Error> {
//     let mut s = String::new();

//     let mut file = File::open("hello.txtsingh")?; // ? propagates the error if file not found
//     file.read_to_string(&mut s)?; 
//     Ok(s) 
// }

// // fn main() {
// //     let num_str = "42";
// //     let num: i32 = num_str.parse().unwrap();
// //     println!("{} ", num + 8); 
// // }

trait Greet{
    fn hello(&self);
    fn bye(&self);
}


struct person {
    name:String

}

impl Greet for person{
    fn hello(&self) {
        println!("hello");

    }

    fn bye(&self) {
        println!("bye");
    }
}

fn main(){
    let per=person{name:"mehul".to_string()};
    per.hello();
    per.bye();

}


