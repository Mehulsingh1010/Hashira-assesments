fn main() {
    let num_str = "42";
    let num: i32 = num_str.parse().unwrap();
    println!("{}", num + 8); // prints 50
}
