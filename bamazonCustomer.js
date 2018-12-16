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
    bamazon();
});

function bamazon() {

    // show all of the items available for sale
    connection.query("SELECT * FROM products ORDER BY products.product_name", function (err, res) {
        if (err) throw err;
        welcomeMsg();

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
                console.log(answer.itemSelect);

                inquirer
                    // how many units do you want to buy?
                    .prompt([
                        {
                            name: "itemQuantity",
                            type: "input",
                            message: "How many?",
                            validate: function(value) {
                                if (isNaN(value) === false) {
                                  return true;
                                }
                                return false;
                              }
                        }
                    ])
                    .then(function (quantity) {
                        console.log(answer.itemSelect);
                        console.log(quantity.itemQuantity);

                        var query = "SELECT item_id, product_name, price, stock_quantity FROM products WHERE ?";

                        connection.query(query, { item_id: answer.itemSelect },
                            function (err, res) {
                                if (err) throw err;
                                console.log(res);

                                // check stock_quantity
                                // if items_wanted < stock_quantity
                                if (quantity.itemQuantity < res[0].stock_quantity) {
                                    // fulfill order
                                    // update bamazon.sql to reflect remaining quantity
                                    // then show customer total cost of purchase
                                    console.log("In stock!");

                                } else {

                                    // if items_wanted > stock_quantity, log "Insufficient quantity" and return to the units question
                                    console.log(`There's not enough stock to fulfill your request. Please enter a lower quantity.`)
                                }
                            }
                        );
                    });
            });
    });
};

function welcomeMsg() {
    console.log(`*************************************\n*************************************\n*************************************\n======== WELCOME TO BAMAZON! ========\n*************************************\n*************************************\n*************************************\n\nYou're connected as ID: ${connection.threadId}\n`);
}