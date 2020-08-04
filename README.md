# BAMAZON
_A simple storefront and inventory database_

## HOW IT WORKS

This application takes in user input for single-product purchases.

1.  Bamazon shows the user a list of products

2. The user selects a product and tells Bamazon the corresponding product ID

3. The user tells Bamazon a desired quantity

4. Bamazon compares the user's desired quantity with the current inventory

*  The purchase cannot move forward until the user requests a quantity that's less than or equal to what's in stock

5. Once a fulfillable quantity is requested, Bamazon processes the order and simultaneously reduces that product's quantity in the inventory database
