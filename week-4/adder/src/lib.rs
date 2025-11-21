// use std::fmt::format;

// pub fn add(left: u64, right: u64) -> u64 {
//     left + right
// }

// pub fn greeting(name:&str) ->String{
//     format!("hello!")
// }

// #[derive(Debug)]
// struct Rectangle{
//     height:i32,
//     width:i32
// }

// impl Rectangle{
//     fn can_hold(&self, other:&Rectangle) ->bool{
//         self.width > other.width && self.height > other.height
//     }
// }

// #[cfg(test)]
// mod tests {
//    use super::*;

//    #[test]
//    fn larger_can(){
//     let larger=Rectangle{
//         width:8,
//         height:7
//     };

//     let smaller=Rectangle{
//         height:3,
//         width:2
//     };

//     assert!(larger.can_hold(&smaller));
// }

//     #[test]
//     fn add(){
//         assert_eq!(4+2,61);
//     }

//     #[test]
//     fn gree_contains(){
//        let res=greeting("hello!");
//        assert!(
//         res.contains("hello!"),
//         "Greeting doesnt have value {}",res
//        );
//     }
// }

// #[cfg(test)]
// mod tests{
//     #[test]
//     fn it_works()->Result<(),String>{
//         if 2+23==4 {
//             Ok(())
//         }else{
//             Err(String::from("two plus two does not equal 4"))
//         }
//     }
// }

// fn it_works(){
//    assert_eq!(2+2,4);
// }


