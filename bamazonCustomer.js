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
    // displayItems() -- show all of the items available for sale: item_id, product_name, price
    connection.query("SELECT * FROM products ORDER BY products.product_name", function (err, res) {
        if (err) throw err;
        console.log("Connected as ID: " + connection.threadId); // WORKS

        // loop through products and log ID, product, price -- WORKS
        for (var i = 0; i < res.length; i++) {
            var item_id = res[i].item_id;
            var product_name = res[i].product_name;
            var price = res[i].price;

            console.log(`Product ID: ${item_id} | ${product_name} | $${price}`);
        }

        // inquirer: prompt user with two messages:
        // ask user item_id of product_name they wanna buy
        // how many units you wanna buy?

        // check stock_quantity:
        // if items_wanted > stock_quantity, log "Insufficient quanity" and return to the units question
        // if items_wanted < stock_quantity, fulfill order:
        // update bamazon.sql to reflect remaining quantity
        // then show customer total cost of purchase
    })
}