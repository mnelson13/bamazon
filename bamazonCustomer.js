let mysql = require("mysql");
let inquirer = require("inquirer");

let connection = mysql.createConnection({
    host: "localhost",
    port: "8889",
    user: "root",
    password: "root",
    database: "bamazonDB"
});

let id;
let quantity;
let newQuantity;
let total;
let newTotal;

connection.connect(function(err){
    if(err) throw err;
    console.log("connected as id " + connection.threadId + "\n");
    displayProducts();
});

function displayProducts(){
    console.log("Available products: ");
    connection.query("SELECT * FROM products", function(err, res){
        if(err) throw err;
        for (i in res){
            let product = res[i];
            console.log(
                "\nID Number: ", product.item_id,
                "|| Name: ", product.product_name,
                "|| Department: ", product.department_name,
                "|| Price: ", product.price
            )
        }
    });
    initialPrompt()
}


function initialPrompt(){
    inquirer.prompt([
        {
            name: "ID",
            message: "Please enter the ID Number of the product that you would like to purchase: "
        },{
            name: "quantity",
            message: "Please enter the quantity that you would like to purchase: "
        }
    ]).then(function(answers){
        id = answers.ID;
        quantity = parseInt(answers.quantity)

        connection.query("SELECT * FROM products WHERE item_id = '" + id + "'", function(err,res){
            if(err) throw err;
            if (quantity <= res[0].stock_quantity){
                newQuantity = res[0].stock_quantity - quantity;
                total = quantity * res[0].price;
                newTotal = res[0].product_sales + total;
                console.log("Thank you for your order! Your order total: ", total);
                updateItem();
                continuePrompt();
            } else {
                console.log("Insufficient Quantity!")
                continuePrompt();
            }
        })
    })
}

function updateItem(){
    connection.query(
        "UPDATE products SET ? WHERE ?",
        [
            {
                stock_quantity : newQuantity,
                product_sales: newTotal
            },
            {
                item_id: id
            }
        ],
        function(err, res){
            if(err) throw err;
        }
    )
}

function continuePrompt(){
    inquirer.prompt([
        {
            type: "list",
            name: "continue",
            message: "Would you like to make a new purchase?",
            choices: ["Yes", "No"]
        }
    ]).then(function(answer){
        if(answer.continue === "Yes"){
            displayProducts()
        } else if(answer.continue === "No") {
            console.log("See you next time!");
            connection.end();
        }
    })
}