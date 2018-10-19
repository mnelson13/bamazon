let mysql = require("mysql");
let inquirer = require("inquirer");

let connection = mysql.createConnection({
    host: "localhost",
    port: "8889",
    user: "root",
    password: "root",
    database: "bamazonDB"
});

connection.connect(function(err){
    if(err) throw err;
    console.log("connected as id " + connection.threadID + "\n");
    initialPrompt();
});

function initialPrompt(){
    
}