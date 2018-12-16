DROP DATABASE IF EXISTS bamazon;
CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products (
	item_id INT AUTO_INCREMENT NOT NULL,
    product_name TEXT (100) NOT NULL,
	department_name TEXT (100) NOT NULL,
    price DECIMAL (10, 4) NOT NULL,
    stock_quantity DECIMAL (10, 4) NOT NULL,
    PRIMARY KEY (item_id)
);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES
("Furby", "Toys", 45.99, 36),
("Velvet sofa", "Furniture", 399.99, 14),
("Deodorant", "Personal Care", 5.99, 64),
("Wooden Photo Frame", "Home Decor", 12.50, 159),
("Beach Barbie", "Toys", 22.99, 542),
("Cherry Wood Coffee Table", "Furniture", 125.70, 42),
("David Bowie Wall Clock", "Home Decor", 26.99, 13),
("iPhone SE Refurbished 64GB", "Electronics", 199.99, 81),
("36-piece Silver Dinnerware Set", "Kitchen", 42.99, 392),
("Star Wars 3D Puzzle, Deathstar", "Toys", 31.00, 920);


SELECT * FROM products;