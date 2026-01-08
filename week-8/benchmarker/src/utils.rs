use rand::{thread_rng,Rng};
use rand::distributions::Alphanumeric;

pub fn generate_key(index: usize)-> String{
    format!("key_{:010}", index)
}

pub fn generate_value(size:usize)-> String{
    thread_rng().sample_iter(&Alphanumeric).take(size).map(char::from).collect()
}



