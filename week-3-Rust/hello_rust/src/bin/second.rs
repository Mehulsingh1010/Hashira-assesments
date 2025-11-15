use std::rc::Rc;
// use core::{error, num};
// use std::{fs::File, io::{self, Read}};
use std::sync::Mutex;
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

use std::{sync::mpsc, thread, time::Duration};


fn main() {
//   let (tx, rx) = mpsc::channel();

//     thread::spawn(move || {
//         let vals = vec![
//             String::from("hi"),
//             String::from("from"),
//             String::from("the"),
//             String::from("thread"),
//         ];

//         for val in vals {
//             tx.send(val).unwrap();
//             thread::sleep(Duration::from_secs(1));
//         }
//     });
// for received in rx {
    //     println!("Got: {received}");
    // }

    let m=Mutex::new(5);
    {
        let mut num =m.lock().unwrap();
        *num=8;
    }
    println!("m={m:?}");

    // let counter =Rc::new(Mutex::new(0)) ;

    // let m=Mutex::new(5);

    println!("m={m:?}");

    // println!("result {{*counter.lock().unwrap()}}")
}


