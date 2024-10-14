
ANGULAR:

<!DOCTYPE html>
<html lang="en">
<head>
    <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.6.9/angular.min.js"></script>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f2f2f2;
            margin: 0;
            padding: 20px;
        }
        h1 {
            color: #333;
        }
        h2 {
            color: #555;
            font-size: 18px;
        }
        input[type="text"] {
            padding: 8px;
            width: 250px;
            margin-bottom: 10px;
            border: 1px solid #ccc;
            border-radius: 4px;
        }
        button {
            background-color: #4CAF50;
            color: white;
            padding: 10px 20px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            margin-top: 10px;
        }
        button:hover {
            background-color: #45a049;
        }
        ul {
            list-style-type: none;
            padding: 0;
        }
        ul li {
            background-color: #fff;
            padding: 10px;
            margin-bottom: 8px;
            border-radius: 4px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }
        ul li button {
            background-color: #ff4c4c;
            padding: 6px 12px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            color: white;
        }
        ul li button:hover {
            background-color: #ff1a1a;
        }
    </style>
</head>
<body>
    <h1>SHOPPING CART</h1>

    <div ng-app="myapp" ng-controller="mycrt">
        <h2>FIRSTNAME: <input type="text" ng-model="fname"></h2>
        <h2>LASTNAME: <input type="text" ng-model="lname"></h2>
        <button ng-click="changename()">CHANGENAME</button>

        <h2>PHONENUMBER: <input type="text" ng-model="phoneno"></h2>
        <h2>ADDRESS: <input type="text" ng-model="add"></h2>
        <h2>CAPTCHA: <input type="text" ng-model="capcha"></h2>
        <h2>ITEM LIST: <input type="text" ng-list="," ng-model="itemlist"></h2>

        <button ng-click="sendCustomerDetails()">SEE CUSTOMER DETAILS</button>
        <p>{{fname + " " + lname}}</p>
        <p>{{phoneno}}</p>
        <p>{{add}}</p>

        <button>SEE ITEMS</button>
        <p>{{itemlist}}</p>

        <h2>ITEM NAME: <input type="text" ng-model="itemname"></h2>
        <h2>ITEM QUANTITY: <input type="text" ng-model="quantity"></h2>
        <button ng-click="additems()">ADD ITEMS</button>

        <ul>
            <li ng-repeat="item in items">
                {{item.name}} - {{item.quantity}}
                <button ng-click="removeitems(item._id)">REMOVE ITEMS</button>
            </li>
        </ul>
    </div>

    <script>
        var app = angular.module("myapp", []);

        app.controller("mycrt", function($scope, $http, capchaservice) {
            $scope.fname = "Srimathi";
            $scope.lname = "Rengharajan";

            $scope.changename = function() {
                $scope.fname = "";
                $scope.lname = "";
            };

            $scope.phoneno = "";
            $scope.capcha = capchaservice.addition(12, 13);
            $scope.items = [];  // Initialize items array

            // Fetching items from backend
            $http.get('http://localhost:3001/get-items')
                .then(function(response) {
                    $scope.items = response.data;  // Store fetched items
                });

            // Add items function (Backend call)
            $scope.additems = function() {
                const item = {
                    name: $scope.itemname,
                    quantity: $scope.quantity
                };

                $http.post('http://localhost:3001/add-item', item)
                    .then(function(response) {
                        $scope.items.push(response.data.item);  // Add the new item to the local array
                        $scope.itemname = "";
                        $scope.quantity = "";
                    });
            };

            // Remove items function (Backend call)
            $scope.removeitems = function(id) {
                $http.delete(`http://localhost:3001/remove-item/${id}`)
                    .then(function(response) {
                        // Remove the item from the local array
                        $scope.items = $scope.items.filter(item => item._id !== id);
                    });
            };

            // Send customer details to backend
            $scope.sendCustomerDetails = function() {
                const customer = {
                    fname: $scope.fname,
                    lname: $scope.lname,
                    phoneno: $scope.phoneno,
                    add: $scope.add
                };

                $http.post('http://localhost:3001/customer-details', customer)
                    .then(function(response) {
                        console.log(response.data.message);
                    });
            };
        });

        app.service("capchaservice", function() {
            this.addition = function(a, b) {
                return a + b;
            };
        });
    </script>
</body>
</html>


NODE:

// server.js
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors'); // To allow cross-origin requests from AngularJS

const app = express();
app.use(bodyParser.json());
app.use(cors());

// Connect to MongoDB (Replace <db_password> with your MongoDB password)
const dbURI = "mongodb+srv://srimathi:srimathi@cluster0.zcq3f.mongodb.net/sample_mflix?retryWrites=true&w=majority&appName=Cluster0";

mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Define a schema and model for the cart items
const itemSchema = new mongoose.Schema({
  name: String,
  quantity: String
});

const Item = mongoose.model('Item', itemSchema);

// API Routes
// 1. Add an item
app.post('/add-item', async (req, res) => {
  const { name, quantity } = req.body;
  const newItem = new Item({ name, quantity });
  await newItem.save();
  res.json({ message: 'Item added successfully' });
});

// 2. Get all items
app.get('/get-items', async (req, res) => {
  const items = await Item.find();
  res.json(items);
});

// 3. Delete an item
app.delete('/remove-item/:id', async (req, res) => {
  const { id } = req.params;
  await Item.findByIdAndDelete(id);
  res.json({ message: 'Item removed successfully' });
});

// Start the server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});



XML:

<?xml version="1.0" encoding="UTF-8"?>
<ShoppingCart>
    <Title>SHOPPING CART</Title>

    <CustomerDetails>
        <FirstName>Srimathi</FirstName>
        <LastName>Rengharajan</LastName>
        <PhoneNumber></PhoneNumber>
        <Address></Address>
        <Captcha>25</Captcha>
        <ItemList></ItemList>
    </CustomerDetails>

    <Items>
        <Item>
            <ItemName></ItemName>
            <Quantity></Quantity>
        </Item>
        <!-- Add more items as needed -->
    </Items>

    <Operations>
        <ChangeName></ChangeName>
        <SeeCustomerDetails></SeeCustomerDetails>
        <SeeItems></SeeItems>
        <AddItems></AddItems>
        <RemoveItems></RemoveItems>
    </Operations>
</ShoppingCart>


XSL:


<?xml version="1.0" encoding="UTF-8"?>

<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
    <xsl:output method="html" indent="yes"/>

    <!-- Template to match the root element -->
    <xsl:template match="/">
        <html>
            <head>
                <title>Shopping Cart</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        background-color: #f2f2f2;
                        margin: 0;
                        padding: 20px;
                    }
                    h1 {
                        color: #333;
                    }
                    h2 {
                        color: #555;
                        font-size: 18px;
                    }
                    ul {
                        list-style-type: none;
                        padding: 0;
                    }
                    ul li {
                        background-color: #fff;
                        padding: 10px;
                        margin-bottom: 8px;
                        border-radius: 4px;
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
                    }
                </style>
            </head>
            <body>
                <h1>SHOPPING CART</h1>

                <!-- Displaying Customer Details -->
                <h2>Customer Information</h2>
                <p>First Name: <xsl:value-of select="ShoppingCart/CustomerDetails/FirstName"/></p>
                <p>Last Name: <xsl:value-of select="ShoppingCart/CustomerDetails/LastName"/></p>
                <p>Phone Number: <xsl:value-of select="ShoppingCart/CustomerDetails/PhoneNumber"/></p>
                <p>Address: <xsl:value-of select="ShoppingCart/CustomerDetails/Address"/></p>
                <p>Captcha: <xsl:value-of select="ShoppingCart/CustomerDetails/Captcha"/></p>

                <!-- Displaying Items -->
                <h2>Item List</h2>
                <ul>
                    <xsl:for-each select="ShoppingCart/Items/Item">
                        <li>
                            Item: <xsl:value-of select="ItemName"/> - Quantity: <xsl:value-of select="Quantity"/>
                        </li>
                    </xsl:for-each>
                </ul>
            </body>
        </html>
    </xsl:template>
</xsl:stylesheet>



FACTORY:

<!DOCTYPE html>
<html ng-app="myapp">
<head>
  <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.6.9/angular.min.js"></script>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f2f2f2;
      margin: 0;
      padding: 20px;
    }
    h1 {
      color: #333;
    }
    h2 {
      color: #555;
      font-size: 18px;
    }
    input[type="text"] {
      padding: 8px;
      width: 250px;
      margin-bottom: 10px;
      border: 1px solid #ccc;
      border-radius: 4px;
    }
    button {
      background-color: #4CAF50;
      color: white;
      padding: 10px 20px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      margin-top: 10px;
    }
    button:hover {
      background-color: #45a049;
    }
    ul {
      list-style-type: none;
      padding: 0;
    }
    ul li {
      background-color: #fff;
      padding: 10px;
      margin-bottom: 8px;
      border-radius: 4px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }
    ul li button {
      background-color: #ff4c4c;
      padding: 6px 12px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      color: white;
    }
    ul li button:hover {
      background-color: #ff1a1a;
    }
  </style>
</head>
<body>
  <h1>SHOPPING CART</h1>
  <div ng-controller="mycrt">
    <h2> FIRSTNAME: <input type="text" ng-model="fname"></h2>
    <h2> LASTNAME: <input type="text" ng-model="lname"></h2>
    <button ng-click="changename()"> CHANGENAME </button>

    <h2> PHONENUMBER: <input type="text" ng-model="phoneno"></h2>
    <h2> ADDRESS: <input type="text" ng-model="add"></h2>
    <h2> CAPTCHA: <input type="text" ng-model="capcha"></h2>
    <h2> ITEM LIST: <input type="text" ng-list="," ng-model="itemlist"></h2>

    <h2> ITEM NAME: <input type="text" ng-model="itemname"></h2>
    <h2> ITEM QUANTITY: <input type="text" ng-model="quantity"></h2>
    <button ng-click="additems()"> ADD ITEMS </button>

    <ul>
      <li ng-repeat="item in items">
        {{item.name}} - {{item.quantity}}
        <button ng-click="removeitems($index)"> REMOVE ITEMS </button>
      </li>
    </ul>

    <h2>CUSTOMER DETAILS:</h2>
    <p>{{fname + " " + lname}}</p>
    <p>{{phoneno}}</p>
    <p>{{add}}</p>

    <h2>ITEMS:</h2>
    <p>{{itemlist}}</p>
  </div>

  <script>
    var app = angular.module("myapp", []);

    app.controller("mycrt", function($scope, billfactory) {
      $scope.fname = "Srimathi";
      $scope.lname = "Rengharajan";
      $scope.changename = function() {
        $scope.fname = "";
        $scope.lname = "";
      };
      $scope.phoneno = "";
      $scope.capcha = ""; // Set a default value or handle CAPTCHA as needed
      $scope.itemlist = "";

      $scope.items = billfactory.getitems();
      $scope.additems = function() {
        billfactory.additems($scope.itemname, $scope.quantity);
        $scope.itemname = "";
        $scope.quantity = "";
      };

      $scope.removeitems = function(index) {
        billfactory.removeitems(index);
      };
    });

    app.factory("billfactory", function() {
      var items = [];
      return {
        additems: function(name, quantity) {
          items.push({ name: name, quantity: quantity });
        },
        removeitems: function(index) {
          items.splice(index, 1);
        },
        getitems: function() {
          return items;
        }
      };
    });
  </script>
</body>
</html>


keep angular code and server.js in a directory
npm init -y
npm install express mongoose body-parser cors
node server.js


