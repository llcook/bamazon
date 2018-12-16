var mysql = require("mysql"); // NPM I COMPLETE!
var inquirer = require("inquirer"); // NPM I COMPLETE!

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

    // show all of the items available for sale
    connection.query("SELECT * FROM products ORDER BY products.product_name", function (err, res) {
        if (err) throw err;

        console.log(`\n============ Product List ===========\n\n`);

        // loop through products and log ID, product, price -- WORKS
        for (var i = 0; i < res.length; i++) {
            var item_id = res[i].item_id;
            var product_name = res[i].product_name;
            var price = res[i].price;

            console.log(`${product_name} | $${price} | Product ID: ${item_id}\n`);
        }

        // inquirer: prompt user with two messages:
        inquirer
            .prompt([
                // ask user item_id of product_name they wanna buy -- WORKS
                {
                    name: "itemSelect",
                    type: "input",
                    message: "Please enter the Product ID number for the item you'd like to buy:"
                }
            ])
            .then(function (answer) {

                var query = "SELECT item_id, product_name, price, stock_quantity FROM products WHERE ?";

                connection.query(query, { item_id: answer.itemSelect },
                    function (err, res) {
                        if (err) throw err;

                        console.log(`\n\nYou selected the ${res[0].product_name} for $${res[0].price}.\n\n`)

                        inquirer
                            // how many units do you want to buy?
                            .prompt([
                                {
                                    name: "itemQuantity",
                                    type: "input",
                                    message: "How many would you like to buy?",
                                    validate: function (value) {
                                        if (isNaN(value) === false)  {
                                            if (value > res[0].stock_quantity) {
                                                console.log(`\nThere's not enough stock to fulfill your request. Please enter a quantity lower than ${value}.`);
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

                                var totalPrice = res[0].price * quantity.itemQuantity;
                                // fulfill order
                                console.log(`\nYour total is $${totalPrice}.\n`);
                                
                                // update bamazon.sql to reflect remaining quantity
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
                                        console.log(`Stock remaining: ${newStock}`);
                                        console.log(`\n\nYour order has been sent!\n\n`);
                                        bamazon();
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