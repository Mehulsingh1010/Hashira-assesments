let id :number=5

console.log("ID:",id);

// ---------------------------------

//basic data types

let id2:number=14
let company:string="Hashira"
let isPublished:boolean=true
let x:any="Hello"


//no error bcoz off any data type
x=true


let ids:number[]=[1,2,3,4,5]

//error bcoz we r pushing string in number array'
// ids.push("hello")' 

ids.push(10);


let arr:any[]=[1,"mehul",true,3.5]
//tuple
let person:[number,string,boolean]=[1,"mehul",true]
//error bcoz of invalid data type
// let person2:[number,string,boolean]=[true,"mehul",1]


//tuple array

let employee:[number,string][];
employee=[
    [1,"mehul"],
    [2,"singh"],
    [3,"ahirwal"]
]

//union

let pid:string|number;

pid="22"
pid=22

//enum
enum Direction{
    Up=1,
    Down,
    Left, 
    Right
}

//object



type User ={
    id2: number;
    name: string;
}
const user: User = {
    id2: 3,
    name: "mehul"
}


//functions

function addNum(x:number,y:number){
    return x+y;
}

console.log(addNum(2,3));
 