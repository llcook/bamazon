var mysql = require("mysql");
var inquirer = require("inquirer");
var table = require("console.table");

var connection = mysql.createConnection({
    host: "localhost",
    port: 8889,
    user: "root",
    password: "root",
    database: "bamazon"
})

connection.connect(function (err) {
    if (err) throw err;
    welcomeMsg();
    bamazon();
});

function bamazon() {

    // show items available for sale
    connection.query("SELECT * FROM products ORDER BY products.product_name", function (err, res) {
        if (err) throw err;

        console.log(`\n============ Product List ===========\n\n`);

        // loop through products and display ID, name, price
        for (var i = 0; i < res.length; i++) {
            var item_id = res[i].item_id;
            var product_name = res[i].product_name;
            var price = res[i].price;

            console.table(`${product_name} | $${price} | Product ID: ${item_id}\n`);
        }

        // prompt user input
        inquirer
            .prompt([
                {
                    name: "itemSelect",
                    type: "input",
                    message: "Please enter the Product ID number for the item you'd like to buy:"
                }
            ])
            .then(function (answer) {

                // target items in products table to compare with user input
                var query = "SELECT item_id, product_name, price, stock_quantity FROM products WHERE ?";

                connection.query(query, { item_id: answer.itemSelect },
                    function (err, res) {
                        if (err) throw err;

                        console.log(`\n\nYou selected the ${res[0].product_name} for $${res[0].price}.\n\n`)

                        inquirer
                            .prompt([
                                {
                                    name: "itemQuantity",
                                    type: "input",
                                    message: "How many would you like to buy?",

                                    // only allows program to move forward if user inputs a number
                                    // and if that number is not greater than than the remaining stock_quantity
                                    validate: function (value) {
                                        if (isNaN(value) === false) {
                                            if (value > res[0].stock_quantity) {
                                                console.log(`\n\nThere's not enough stock to fulfill your request. Please enter a quantity lower than ${value}.\n`);
                                                return false;
                                            }
                                            return true;
                                        }
                                        console.log(`\n Error: Please enter a number.`);
                                        return false;
                                    }
                                }
                            ])
                            .then(function (quantity) {

                                console.log(`\nOrder complete!`);

                                // calculates the total order price
                                var totalPrice = res[0].price * quantity.itemQuantity;

                                // 
                                console.log(`\nYour total is $${totalPrice.toFixed(2)}.`);

                                // update bamazon.sql to reflect remaining quantity after user's purchase
                                var updateInventory = "UPDATE products SET ? WHERE ?";
                                var newStock = res[0].stock_quantity - quantity.itemQuantity;
                                var selectedItem = res[0].item_id;

                                connection.query(updateInventory,
                                    [
                                        {
                                            stock_quantity: newStock
                                        },
                                        {
                                            item_id: selectedItem
                                        }
                                    ],
                                    function (err) {
                                        if (err) throw err;

                                        inquirer
                                            .prompt([
                                                {
                                                    type: "confirm",
                                                    message: "Would you like to shop again?",
                                                    name: "confirm",
                                                    default: true
                                                }
                                            ])
                                            .then(function (response) {
                                                if (response.confirm) {
                                                    bamazon();
                                                } else {
                                                    console.log(`Thanks for shopping Bamazon! See you next time.`);
                                                    connection.end();
                                                }
                                            })
                                    })

                            }
                            );
                    });
            });
    });
};

function welcomeMsg() {
    console.log(`*************************************\n*************************************\n*************************************\n======== WELCOME TO BAMAZON! ========\n*************************************\n*************************************\n*************************************\n\nYou're connected as ID: ${connection.threadId}\n`);
}