use std::fmt::Display;

 struct NewsArticle {
    pub headline: String,
    pub author: String,
    pub content: String,
}

impl Summary for NewsArticle{
    fn summarize(&self)->String{
        format!("{}, by {}", self.headline, self.author)
    }
}

struct Tweet{
    pub username: String,
    pub content: String,
    pub reply: bool,
    pub retweet: bool,
}

impl Summary for Tweet{
    fn summarize(&self)->String{
        format!("{}: {}",self.username,self.content)
    }
}

// fn notify(item : &impl Summary){
//     println!("Breaking news! {}",item.summarize())
// }

fn notify<X:Summary + Display>(item:&X){
    println!("Breaking news! {}",item.summarize())
}

trait Summary{
    fn summarize(&self)->String;

}

fn main(){
    let tweet=Tweet{
        username:String::from("horse_ebooks"),      
        content:String::from("of course, as you probably already know, people"),
        reply:false,
        retweet:false,
    };

    let article=NewsArticle{
        headline:String::from("Penguins win the Stanley Cup Championship!"),
        author:String::from("Iceburgh"),
        content:String::from("The Pittsburgh Penguins once again are the best hockey team in the NHL")    
    };

    println!(" Tweet Summary : {}", tweet.summarize());
    println!(" Article Summary : {}", article.summarize());


 

}
