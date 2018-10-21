Drop DATABASE IF EXISTS bamazonDB;
CREATE DATABASE bamazonDB;

USE bamazonDB;

DROP TABLE IF EXISTS products;
CREATE TABLE products(
    item_id INTEGER NOT NULL AUTO_INCREMENT,
    product_name VARCHAR(255) NOT NULL,
    department_name VARCHAR(255),
    price DECIMAL(10,2) NOT NULL,
    stock_quantity INTEGER(10),
    product_sales DECIMAL(10,2) DEFAULT 0,
    PRIMARY KEY (item_id)
);

INSERT INTO products(product_name, department_name, price, stock_quantity)
VALUES ("Kindle", "Electronics", 115.00, 20), 
("Nintendo Switch", "Electronics", 250.00, 10),
("Zelda Game", "Electronics", 60.00, 30),
("Sweater", "Clothing", 45, 50),
("Shoes", "Clothing", 20, 30),
("A Storm of Swords", "Books", 30, 40),
("Game of Thrones", "Books", 25, 20),
("5 Pack of Frozen Pizzas", "Food", 10, 20),
("Cat Condo", "Pet Supplies", 120, 4),
("Dog House", "Pet Supplies", 250, 10);


DROP TABLE IF EXISTS departments;
CREATE TABLE departments(
    department_id INTEGER NOT NULL AUTO_INCREMENT,
    department_name VARCHAR(255) NOT NULL,
    over_head_costs DECIMAL(10,2),
    PRIMARY KEY (department_id)
);

INSERT INTO departments(department_name, over_head_costs)
VALUES ("Electronics", 500),
("Clothing", 200),
("Books", 100),
("Food", 100),
("Pet Supplies", 200)


