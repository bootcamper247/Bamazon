//Dependencies
var mysql = require("mysql");
var inquirer = require("inquirer");


var connection = mysql.createConnection({
    host: "localhost",

    // Your port - from MYSQL workbench
    port: 8889,

    // Your username
    user: "root",

    // Your password
    password: "root",
    database: "bamazon"
});

connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);

    //first display  the ids, names, and prices of all of the items avail for sale. 
    displayProducts();

});

// function which prompts the user
function start() {
    inquirer
        .prompt([
            {
                name: "prodID",
                type: "input",
                message: "Please Enter the ID of the product you'd like to buy > "
                //validate: enter validation code
            },
            {
                type: "input",
                name: "qty",
                message: "Please Enter the number of units you'd like to buy > "
            }
        ])
        .then(function (answer) {

            // check if qty entered is available
            checkProdQty(answer.prodID, answer.qty);
        });
}

function checkProdQty(p_id, units_needed) {

    let qty_avail = 0;
    let total = 0;
    let productName = "";
    let qty = 0;

    let command = "SELECT stock_quantity, price, product_name FROM products where ?";
    let condition = { item_id: p_id };

    connection.query(command, condition, function (err, res) {
        if (err) throw err;
        // logs the actual query being run
        //console.log(this.sql);

        qty_avail = parseInt(res[0]["stock_quantity"]);
        price = parseFloat(res[0]["price"]);
        productName = res[0]["product_name"];

        if (qty_avail === 0) {
            console.log("SORRY! This item is out of stock. Please try again later")
            connection.end();
        } else {
            if (units_needed <= qty_avail) {
                total = units_needed * price;
                msg = "Your order total will be $" + total.toFixed(2);
                qty = units_needed;
                newQty = qty_avail - units_needed;

            } else {
                msg = "SORRY! We only have " + qty_avail + " " + productName + " currently available";
                total = qty_avail * price;
                qty = qty_avail;
                msg = msg + "\nIf you'd like to purchase " + qty + " units, your order total will be $" + total.toFixed(2);
                newQty = 0;
            }

            confirmPrompt(productName, qty, msg, p_id, newQty);
        }

        });

}

function confirmPrompt(name, qty, msg, id, new_qty) {

    let displayMsg = msg + "\nWould you like to checkout? ";
    inquirer
        .prompt([

            {
                type: "confirm",
                message: displayMsg,
                name: "confirm",
                default: true

            }
        ])
        .then(function (answer) {

            if (answer.confirm) {
                updateProducts(id, new_qty);
                console.log("Your Order for " + qty + " " + name + " has been fulfilled! \nThankyou for shopping with us");
            }
            else {
                console.log(" Please Visit us again. Bye!");
                connection.end();
            }

        });
}

function updateProducts(arg_id, arg_qty) {

    let command = "UPDATE products SET ? WHERE ?";
    let condition = [{ stock_quantity: arg_qty }, { item_id: arg_id }];

    connection.query(command, condition, function (err, res) {
        //console.log(this.sql);
        if (err) throw err;
        connection.end();
    });

}

function displayProducts() {
    let command = "SELECT item_id, product_name, price FROM products";
    connection.query(command, function (err, res) {
        if (err) throw err;
        // logs the actual query being run
        console.log(this.sql);
        console.table(res);
        start();
    });
}
















