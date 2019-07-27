# Bamazon
Bamazon-CLI is a node command line interface that interacts with the Bamazon SQL Database. It allows the users to view and purchase items from the inventory. It allows Managers to edit and manage the products in the Bamazon database. 

### Node.js & MySQL


### #1: Customer View -- `bamazonCustomer.js`

Running this application displays all of the items available for sale. Includes the ids, names, and prices of products for sale.

The app then prompts users with two messages.

   * The first asks them the ID of the product they would like to buy.
   * The second message asks how many units of the product they would like to buy.

Once the customer has placed the order,the app checks if store has enough of the product to meet the customer's request.

   * If not, the app displays current quantity and checks again with customer
   
However, if the store _does_ have enough of the product, the customer's order is fulfilled.
   * The SQL database is updated to reflect the remaining quantity.
   * Once the update goes through, the customer is shown the total cost of their purchase.
   
![Image of View Products](https://github.com/bootcamper247/Bamazon/blob/master/images/CustomerBuy.png)
![Image of View Products](https://github.com/bootcamper247/Bamazon/blob/master/images/CustomerBuyShort.png)
![Image of View Products](https://github.com/bootcamper247/Bamazon/blob/master/images/CustomerRejectShort.png)

### #2: Manager View -- `bamazonManager.js`

In the Manager View the manager can View the Current Inventory, Check Low Inventory Stock, Add Inventory Stock, or Add New Inventory.

![Image of View Products](https://github.com/bootcamper247/Bamazon/blob/master/images/ManagerView.png)
![Image of View Products](https://github.com/bootcamper247/Bamazon/blob/master/images/ManagerAdd.png)
![Image of View Products](https://github.com/bootcamper247/Bamazon/blob/master/images/ManagerAddNew.png)
![Image of View Products](https://github.com/bootcamper247/Bamazon/blob/master/images/ManagerLow.png)
