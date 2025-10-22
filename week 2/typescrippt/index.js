var id = 5;
console.log("ID:", id);
// ---------------------------------
//basic data types
var id2 = 14;
var company = "Hashira";
var isPublished = true;
var x = "Hello";
//no error bcoz off any data type
x = true;
var ids = [1, 2, 3, 4, 5];
//error bcoz we r pushing string in number array'
// ids.push("hello")' 
ids.push(10);
var arr = [1, "mehul", true, 3.5];
//tuple
var person = [1, "mehul", true];
//error bcoz of invalid data type
// let person2:[number,string,boolean]=[true,"mehul",1]
//tuple array
var employee;
employee = [
    [1, "mehul"],
    [2, "singh"],
    [3, "ahirwal"]
];
//union
var pid;
pid = "22";
pid = 22;
//enum
var Direction;
(function (Direction) {
    Direction[Direction["Up"] = 1] = "Up";
    Direction[Direction["Down"] = 2] = "Down";
    Direction[Direction["Left"] = 3] = "Left";
    Direction[Direction["Right"] = 4] = "Right";
})(Direction || (Direction = {}));
var user = {
    id2: 3,
    name: "mehul"
};
//functions
function addNum(x, y) {
    return x + y;
}
console.log(addNum(2, 3));
