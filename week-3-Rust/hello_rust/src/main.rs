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

    let num1:u8=10;
    let num2:u8=10;
    add(num1,num2);

}

// fn print_val(item :u8){
//     println!("The vallue being passed from main is {}", item);
// }

fn add(item1:u8, item2:u8){
    let sum:u8=item1+item2;
    println!("{}",sum);
}

//snake_case is followed in rust generally for function and variable names
//CamelCase is followed for struct and enum names
//CONSTANT_CASE is followed for constants and statics


//so RUsT: hello_world (snake case), JS: helloWorld (camel case)