use std::io::{self, ErrorKind, Read,Write};
use std::net::TcpStream;
use std::sync::mpsc::{self,TryRecvError};
use std::thread;
use std::time::Duration;

const LOCAL:&str="127.0.0.1:8080";
const MSG_SIZE:usize=32;

fn sleep (){
    thread::sleep(Duration::from_millis(1000));
}

fn main(){
    let mut client=TcpStream::connect(LOCAL).expect("stream failed to connect");
    client.set_nonblocking(true).expect("failed to init non-blocking");
    let (tx,rx)=mpsc::channel::<String>();

    thread::spawn(
        move ||loop {
            let mut buff=vec![0;MSG_SIZE];
            match client.read_exact(&mut buff){
                Ok(_)=>{
                    let msg=buff.into_iter().take_while(|&x| x!=0).collect::<Vec<_>>();
                println!("Message recv : {:?}",msg);
                },
                Err(ref err) if err.kind()==ErrorKind::WouldBlock=>(),
                Err(_)=>{
                    println!("Connection with serverr closed");
                    break;
                }
            }

            match rx.try_recv(){
                Ok(msg)=>{
                    let mut buff=msg.clone().into_bytes();
                    buff.resize(MSG_SIZE,0);
                    client.write(&buff).expect("Writing to socket failed");

                    println!("Message sent : {:?}", msg);
                },
                Err(TryRecvError::Empty)=>(),
                Err(TryRecvError::Disconnected)=>{break;}
            }

            sleep();
        }
    );

    println!("Write message here :");

    loop{
        let mut buff=String::new();
        io::stdin().read_line(&mut buff).expect("Error reading from input");
        let msg=buff.trim().to_string();    
        if msg==":quit" || tx.send(msg).is_err(){break;}
    }

    println!("Goodbye!");
}