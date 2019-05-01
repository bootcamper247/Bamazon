//Dependencies
var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require("cli-table3");


var connection = mysql.createConnection({

    host: "localhost",
    port: 8889,
    user: "root",
    password: "root",
    database: "bamazon"
});

connection.connect(function (err) {
    if (err) throw err;
    console.log("\nConnection Successful! Connected as id " + connection.threadId + "\n");

    // Start the app and display the prompts menu
    start();

});

function start() {
    inquirer
        .prompt({
            name: "action",
            type: "list",
            message: "Please select from the options listed below",
            choices: [
                "View Products for Sale",
                "View Low Inventory",
                "Add to Inventory",
                "Add New Product",
                "Exit"
            ]
        })
        .then(function (answer) {
            switch (answer.action) {
                case "View Products for Sale":
                    viewProducts();
                    break;

                case "View Low Inventory":
                    viewLowInventory();
                    break;

                case "Add to Inventory":
                    addToInventory();
                    break;

                case "Add New Product":
                    addNewProduct();
                    break;

                case "Exit":
                    console.log("\nBye\n")
                    connection.end();
                    break;
            }
        });
}

function viewProducts() {

    console.log("\nShowing all products currently available for sale\n");

    let command = "SELECT * FROM products"

    connection.query(command, function (err, res) {
        if (err) throw err;

        var prodTable = new Table({
            head: ["ITEM ID", "PRODUCT NAME", "DEPARTMENT", "PRICE($)", "QUANTITY"],
            colWidths: [10, 25, 25, 10, 12]
        });

        for (var i = 0; i < res.length; i++) {
            prodTable.push([res[i]["item_id"], res[i]["product_name"], res[i]["department_name"], parseFloat(res[i]["price"]).toFixed(2), res[i]["stock_quantity"]]);
        }
        console.log(prodTable.toString());
        console.log("\n");
        start();
    });
}

function viewLowInventory() {

    //list all items with an inventory count lower than five.

    var lowCount = 5;

    let sql = "SELECT * FROM products Where stock_quantity < " + mysql.escape(lowCount);

    connection.query(sql, function (err, res) {
        if (err) throw err;
        if (res.length > 0) {
            console.log("\nShowing all items with an inventory count lower than 5\n");

            var prodTable = new Table({
                head: ["ITEM ID", "PRODUCT NAME", "DEPARTMENT", "PRICE($)", "QUANTITY"],
                colWidths: [10, 25, 25, 10, 12]
            });

            for (var i = 0; i < res.length; i++) {
                prodTable.push([res[i]["item_id"], res[i]["product_name"], res[i]["department_name"], parseFloat(res[i]["price"]).toFixed(2), res[i]["stock_quantity"]]);
            }
            console.log(prodTable.toString());

            console.log("\n");
        } else {
            console.log("\nAll stocked items are above the Low Count threshhold\n");
        }
        start();
    });
}

function addToInventory() {

    inquirer
        .prompt([
            {
                name: "prodID",
                type: "input",
                message: "Please Enter the ID of the product you'd like to add to "
                //validate: enter validation code
            },
            {
                type: "input",
                name: "qty",
                message: "Please Enter the number of units you'd like to add > "
            }
        ])
        .then(function (answer) {

            let newQty = 0;

            // get orignal stock_qty for id entered
            let sql = "SELECT stock_quantity from products WHERE item_id = " + mysql.escape(answer.prodID);

            connection.query(sql, function (err, res) {
                if (err) throw err;

                newQty = parseInt(res[0]["stock_quantity"]) + parseInt(answer.qty);

                let sql = "UPDATE products SET stock_quantity = " + mysql.escape(newQty) + " Where item_id = " + mysql.escape(answer.prodID);

                connection.query(sql, function (err, res) {
                    if (err) throw err;
                    console.log("\nRecord Updated\n");
                    start();
                });
            });
        });
}

function addNewProduct() {

    // add a completely new product to the store
    console.log("Please Enter the following information for the new product");

    inquirer
        .prompt([
            {
                name: "prodID",
                type: "input",
                message: "Item ID > "
                //validate: enter validation code
            },
            {
                type: "input",
                name: "name",
                message: "Item Name > "
            },
            {
                name: "dept",
                type: "input",
                message: "Dept. Name > "
            },
            {
                type: "input",
                name: "price",
                message: "Price > "
            },
            {
                type: "input",
                name: "qty",
                message: "Quantity > "
            }
        ])
        .then(function (answer) {

            // insert the record
            let sql = "INSERT INTO products (item_id, product_name, department_name, price, stock_quantity) VALUES ( ?, ?, ?, ?, ?)";
            
            let arr = [parseInt(answer.prodID), answer.name, answer.dept, parseFloat(answer.price), parseInt(answer.qty)];
            //console.table(arr);

            connection.query(sql, arr, function (err, res) {
                if (err) throw err;
                console.log("\nNew item has been added to the Database\n");
                start();
            });
        });
}
