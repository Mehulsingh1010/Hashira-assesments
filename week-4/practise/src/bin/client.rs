use std::io::{self, ErrorKind, Read,Write};
use std::net::TcpStream;
use std::sync::mpsc::{self,TryRecvError};
use std::thread;
use std::time::Duration;



const LOCAL:&str="127.0.0.1:6000";
const MSG_SIZE:usize=32;


fn main(){
    let mut client=TcpStream::connect(LOCAL).expect("Stream failed to connect ");
    client.set_nonblocking(true).expect("failed to iniit non blocking");

    let (send,rec)=mpsc::channel::<String>();

    thread::spawn(move || loop{
        let mut buff= vec![0; MSG_SIZE];
        match client.read_exact(&mut buff){
            Ok(_)=>{
                let msg=buff.into_iter().take_while(|&x| x!=0).collect::<Vec<_>>();
                println!("Message recv : {:?}",msg);
            },
            Err(ref err) if err.kind() ==ErrorKind::WouldBlock=>(),
            Err(_)=>{
                println!("Connected with server");
                break;
            }
        }
        match rec.try_recv() {
            Ok(msg)=>{
                let mut buff = msg.clone().into_bytes();
                buff.resize(MSG_SIZE,0);
                client.write(&buff).expect("Writing to socket failed");

                println!("message sent :{:?}",msg);
            },
            Err(TryRecvError::Empty)=>(),
            Err(TryRecvError::Disconnected)=>{break;}

            
        }
        thread::sleep(Duration::from_millis(1000 ))
    });


    println!("Write message here : ");
    loop{
        let mut buff=String::new();
        io::stdin().read_line(&mut buff).expect("Error reading from input");
        let msg= buff.trim().to_string();
        if msg== ":quit" || send.send(msg).is_err() {break}    
    }
    println!("Goodbye!");
    
}