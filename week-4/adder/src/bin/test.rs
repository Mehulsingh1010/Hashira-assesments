use std::io;

fn main() {
    let mut arr = [1, 2, 3];

    for i in 0..arr.len() {
        let mut input = String::new();

        println!("Enter value for index {}:", i);

        io::stdin()
            .read_line(&mut input)
            .expect("Failed to read input");

        arr[i] = input.trim().parse::<i32>().expect("Not a number");
    }

    println!("{:?}", arr);
}
