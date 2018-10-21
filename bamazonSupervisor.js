let mysql = require("mysql");
let inquirer = require("inquirer");
let Table = require("cli-table");


let connection = mysql.createConnection({
    host: "localhost",
    port: "8889",
    user: "root",
    password: "root",
    database: "bamazonDB"
});

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
            choices: ["View Product Sales by Department", "Create New Department", "Exit"]
        }
    ]).then(function(answer){
        if(answer.action === "View Product Sales by Department"){
            viewSales();
        } else if (answer.action === "Create New Department"){
            addDepartment();
        } else if (answer.action === "Exit"){
            console.log("See you next time!");
            connection.end();
        }
    })
};

function viewSales(){
    let table = new Table({
                head: ["Department ID", "Department Name", "Over Head Costs", "Product Sales", "Total Profits"],
            });

    connection.query("SELECT d.department_id, d.department_name, d.over_head_costs, SUM(p.product_sales) AS product_sales FROM bamazonDB.products AS p JOIN bamazonDB.departments AS d ON p.department_name = d.department_name GROUP BY d.department_id, d.department_name, d.over_head_costs", function(err, res){
        if(err) throw err;
        for(i in res){
            let id = res[i].department_id;
            let name = res[i].department_name;
            let costs = res[i].over_head_costs;
            let sales = res[i].product_sales;
            let profit = sales - costs;
            table.push([id, name, costs, sales, profit])
        }

        console.log(table.toString());
        
        initialPrompt();
    })
};


function addDepartment(){
    inquirer.prompt([
        {
            name: "name",
            message: "Enter department name: "
        },{
            name: "costs",
            message: "Enter over head costs: ",
        },{
            name: "product",
            message: "Enter this department's first product: "
        },{
            name: "price",
            message: "Enter product price: "
        },{
            name: "quantity",
            message: "Enter product quantity: "
        }
    ]).then(function(answers){
        let deptName = answers.name;
        let costs = answers.costs;
        let product = answers.product;
        let price = answers.price;
        let quantity = answers.quantity;
        
        console.log("Inserting a new department...\n");
        connection.query(
            "INSERT INTO departments SET ?",
            {
                department_name: deptName,
                over_head_costs: costs
            },
            function(err, res){
                if(err) throw err;
                console.log(res.affectedRows + " departments inserted!\n");
            }
        )
        connection.query(
            "INSERT INTO products SET ?",
            {
                product_name: product,
                department_name: deptName,
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