const express = require("express");
const app = express();
var methodOverride = require('method-override');

PORT = 61178;

// database
const db = require('./db/db-connector.js')

// views
const {
  Home,
  Customers,
  Invoices,
  Sales,
  Weapons,
  Materials,
  WeaponMaterials
} = require('./views.js');

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));


/********
  Routes
 ********/

app.get(['/', '/home'], async (req, res) => {
  try {

    res.send(Home());
  } catch (err) {
    console.log(`GET / ERROR: \n${err}`);
    res.status(500);
  }
});

app.get('/customers', async (req, res) => {
  try {

    let query = "SELECT customer_id,name,level FROM Customers;";

    db.pool.query(query, function(error, rows, fields) {
      
      if (error) {
        console.error(`DB get customers error: \n${error}`);
        res.status(400);
        return ;
      }
      let customers = rows;
      res.send(Customers(customers));
    });

  } catch (err) {
    console.log(`GET / error: \n${err}`);
    res.status(500);
  }
});

app.post('/customers', (req,res) => {

  try {
    // add customer
    let data = req.body
    let level = parseInt(data["customer-add-level"]);
    let name = data["customer-add-name"];

    let query1 = `
      INSERT INTO 
        Customers (name, level) 
      VALUES 
        ("${name}", ${level}) ;`;

    db.pool.query(query1, function(error, rows, fields) {
      if (error) {
        console.error(`DB Add Customer error: \n${error}`);
        res.status(400);
        return ;
      }
    });

    // return new page
    let query2 = `
      SELECT 
        customer_id,
        name,
        level 
      FROM 
        Customers;`;

    db.pool.query(query2, (error, rows, fields) => {
      let customers = rows;
      res.send(Customers(customers));
    });

  } catch (err) {
    console.log(`POST / error: \n${err}`);
    res.status(400);
  }

});

app.put('/customers', (req,res) => {

  let customer_id = parseInt(req.body["customer-edit-id"]);
  let name = req.body["customer-edit-name"];
  let level = parseInt(req.body["customer-edit-level"]);

  try {

    // add customer
    let query1 = `
      UPDATE Customers 
      SET 
        level = ${level}, 
        name = "${name}"
      WHERE 
        customer_id = ${customer_id}`;

    db.pool.query(query1, function(error, rows, fields) {
      if (error) {
        console.error(`DB Edit Customer error: \n${error}`);
        res.status(400);
        return ;
      }
    });

    // return new page
    let query2 = `
      SELECT 
        customer_id,
        name,
        level 
      FROM 
        Customers;`;

    db.pool.query(query2, (error, rows, fields) => {
      let customers = rows;
      res.send(Customers(customers));
    });

  } catch (err) {

    console.log(`PUT /customers error: \n${err}`);
    res.status(400);
  }

});

app.delete('/customers', (req,res) => {

  try {

    // add customer
    let name = req.body["customer-delete-name"];

    let query1 = `
      DELETE FROM
        Customers
      WHERE 
        name = "${name}"`;

    db.pool.query(query1, (error, rows, fields) => {
      if (error) {
        console.error(`DB Add Customer error: \n${error}`);
        res.status(400);
        return ;
      }
    });

    // return new page
    let query2 = `
      SELECT 
        customer_id,
        name,
        level 
      FROM 
        Customers;`;

    db.pool.query(query2, (error, rows, fields) => {
      let customers = rows;
      res.send(Customers(customers));
    });

  } catch (err) {

    console.log(`DELETE /customers error: \n${err}`);
    res.status(400);
  }

});








app.get('/invoices', async (req, res) => {
  try {
    res.send(Invoices());
  } catch (err) {
    console.log(`GET / ERROR: \n${err}`);
    res.status(500);
  }
});

app.get('/sales', async (req, res) => {
  try {
    res.send(Sales());
  } catch (err) {
    console.log(`GET / ERROR: \n${err}`);
    res.status(500);
  }
});

app.get('/weapons', async (req, res) => {
  try {
    res.send(Weapons());
  } catch (err) {
    console.log(`GET / ERROR: \n${err}`);
    res.status(500);
  }
});

app.get('/materials', async (req, res) => {
  try {
    res.send(Materials());
  } catch (err) {
    console.log(`GET / ERROR: \n${err}`);
    res.status(500);
  }
});

app.get('/weaponMaterials', async (req, res) => {
  try {
    res.send(WeaponMaterials());
  } catch (err) {
    console.log(`GET / ERROR: \n${err}`);
    res.status(500);
  }
});

app.listen(PORT, function () {
  console.log(`Express started on http://localhost:${PORT} -- Press Ctrl-C to terminate.`);
});
