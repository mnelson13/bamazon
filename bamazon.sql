CREATE DATABASE bamazonDB;

USE bamazonDB;

CREATE TABLE products(
    item_id INTEGER NOT NULL AUTO_INCREMENT,
    product_name VARCHAR(255) NOT NULL,
    department_name ENUM('Electronics', 'Clothing', 'Books', 'Food'),
    price DECIMAL(10,2) NOT NULL,
    stock_quantity INTEGER(10),
    PRIMARY KEY (item_id)
);

INSERT INTO products(product_name, department_name, price, stock_quantity)
VALUES ("Bindle", "Electronics", 115.00, 20), 
("Nintendo Switch", "Electronics", 250.00, 10),
("Zelda Game:", "Electronics", 60.00, 30)


