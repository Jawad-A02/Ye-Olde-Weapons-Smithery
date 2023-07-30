const express = require("express");
const app = express();

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
      
      let customers = rows;
      res.send(Customers(customers));
    });

  } catch (err) {
    console.log(`GET / ERROR: \n${err}`);
    res.status(500);
  }
});

app.post('/customers', (req,res) => {

  try {

    // add customer
    let data = req.body
    let level = parseInt(data["customer-add-level"]);
    let query1 = `INSERT INTO Customers (name, level) VALUES ('${data["customer-add-name"]}', ${level}) ;`;
    db.pool.query(query1, function(error, rows, fields) {
      if (error) {
        console.error(`DB Add Customer error: \n${error}`);
        res.status(400);
        return ;
      }
    });

    // return new page
    let query2 = "SELECT customer_id,name,level FROM Customers;";
    db.pool.query(query2, (error, rows, fields) => {
      let customers = rows;
      res.send(Customers(customers));
    });

  } catch (err) {
    console.log(`GET / ERROR: \n${err}`);
    res.status(400);
  }

});

app.put('/customers', (req,res) => {

  try {
    // edit customer
    let data = req.params["customer-edit-ids"];
    console.log(data)
    return;
    let level = parseInt(data["customer-add-level"]);
    let query1 = `INSERT INTO Customers (name, level) VALUES ('${data["customer-add-name"]}', ${level}) ;`;
    db.pool.query(query1, function(error, rows, fields) {
      if (error) {
        console.error(`DB Add Customer error: \n${error}`);
        res.status(400);
        return ;
      }
    });

    // return new page
    let query2 = "SELECT customer_id,name,level FROM Customers;";
    db.pool.query(query2, (error, rows, fields) => {
      let customers = rows;
      res.send(Customers(customers));
    });

  } catch (err) {
    console.log(`GET / ERROR: \n${err}`);
    res.status(400);
  }

});

app.delete('/customers', (req,res) => {

  try {

    // add customer
    let data = req.body
    let query1 = `INSERT INTO Customers (name, level) VALUES ('${data["customer-add-name"]}', ${level}) ;`;
    db.pool.query(query1, function(error, rows, fields) {
      if (error) {
        console.error(`DB Add Customer error: \n${error}`);
        res.status(400);
        return ;
      }
    });

    // return new page
    let query2 = "SELECT customer_id,name,level FROM Customers;";
    db.pool.query(query2, (error, rows, fields) => {
      let customers = rows;
      res.send(Customers(customers));
    });

  } catch (err) {
    console.log(`GET / ERROR: \n${err}`);
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
