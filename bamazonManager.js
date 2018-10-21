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
let newQuantity;

connection.connect(function(err){
    if(err) throw err;
    console.log("connected as id " + connection.threadId + "\n");
    initialPrompt();
});

function initialPrompt(){
    inquirer.prompt([
        {
            type: "list",
            name: "action",
            message: "What would you like to do?",
            choices: ["View Products", "View Low Inventory", "Add to Inventory", "Add New Product", "Exit"]
        }
    ]).then(function(answer){
        if(answer.action === "View Products"){
            displayProducts();
            initialPrompt();
        } else if (answer.action === "View Low Inventory"){
            lowInventory();
        } else if (answer.action === "Add to Inventory"){
            addInventory();
        } else if (answer.action === "Add New Product"){
            addProduct();
        } else if (answer.action === "Exit"){
            console.log("See you next time!");
            connection.end();
        }
    })
}

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
                "|| Price: ", product.price,
                "|| Quantity: ", product.stock_quantity
            )
        }
    });
}

function lowInventory(){
    console.log("Products with low Inventory: ");
    connection.query("SELECT * FROM products WHERE stock_quantity < 5", function(err, res){
        if(err) throw err;
        for (i in res){
            let product = res[i];
            console.log(
                "\nID Number: ", product.item_id,
                "|| Name: ", product.product_name,
                "|| Department: ", product.department_name,
                "|| Price: ", product.price,
                "|| Quantity: ", product.stock_quantity
            )
        }
    });
    initialPrompt()
}

function addInventory(){
    displayProducts();
    inquirer.prompt([
        {
            name: "ID",
            message: "Please enter the ID Number of the product that you would like to update: "
        },{
            name: "quantity",
            message: "Please enter the new quantity of the product: "
        }
    ]).then(function(answers){
        id = answers.ID;
        newQuantity = parseInt(answers.quantity)
        updateItem();
    })
}

function updateItem(){
    connection.query(
        "UPDATE products SET ? WHERE ?",
        [
            {
                stock_quantity : newQuantity
            },
            {
                item_id: id
            }
        ],
        function(err, res){
            if(err) throw err;
            console.log(res.affectedRows + " items updated!\n");
            initialPrompt();
        }
    )
}


function addProduct(){
    inquirer.prompt([
        {
            name: "name",
            message: "Enter product name: "
        },{
            name: "department",
            message: "Enter product department: ",
        },{
            name: "price",
            message: "Enter product price: "
        },{
            name: "quantity",
            message: "Enter product quantity: "
        }
    ]).then(function(answers){
        let name = answers.name;
        let department = answers.department;
        let price = answers.price;
        let quantity = answers.quantity;

        console.log("Inserting a new item...\n");
        connection.query(
            "INSERT INTO products SET ?",
            {
                product_name: name,
                department_name: department,
                price: price,
                stock_quantity: quantity
            },
            function(err, res){
                if(err) throw err;
                console.log(res.affectedRows + " items inserted!\n");
                initialPrompt();
            }
        )
    })
}