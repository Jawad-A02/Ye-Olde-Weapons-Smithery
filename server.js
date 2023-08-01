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

// Select queries
const get_customers = `
    SELECT 
      customer_id, name, level 
    FROM 
      Customers;`;

const get_invoices = `
    SELECT 
      Invoices.invoice_id, Customers.name, 
      Invoices.date, SUM(Sales.price)
    FROM Invoices
      LEFT JOIN Sales ON Invoices.invoice_id = Sales.invoice_id
      INNER JOIN Customers ON Invoices.customer_id = Customers.customer_id
    GROUP BY Invoices.invoice_id, Invoices.total_price;`;

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

    //send new data
  let data2 = get_table(get_customers);

  if (data2[1] === true) {
    let customers = data2[0];
    res.send(Customers(customers));
  } else {
    console.error(`DB get customers error: \n${data2[0]}`);
    res.status(400);
  }
});

app.post('/customers', (req,res) => {
  // add customer
  let data = req.body;
  let level = parseInt(data["customer-add-level"]);
  let name = data["customer-add-name"];

  let query = `
    INSERT INTO 
      Customers (name, level) 
    VALUES 
      ("${name}", ${level}) ;`;

  //result of adding customer
  let result = insert_table(query);
  if (result[1] === false) {
      console.error(`DB Add Customer error: \n${error}`);
      res.status(400);
  }

      //send new data
  let data2 = get_table(get_customers);

  if (data2[1] === true) {
    let customers = data2[0];
    res.send(Customers(customers));
  } else {
    console.error(`DB get customers error: \n${data2[0]}`);
    res.status(400);
  }
});

app.put('/customers', (req,res) => {

  let customer_id = parseInt(req.body["customer-edit-id"]);
  let name = req.body["customer-edit-name"];
  let level = parseInt(req.body["customer-edit-level"]);

  // edit customer
  let query = `
    UPDATE Customers 
    SET 
      level = ${level}, 
      name = "${name}"
    WHERE 
      customer_id = ${customer_id}`;

  //result of editing customer
  let result = edit_table(query);
  if (result[1] === false) {
      console.error(`DB Edit Customer error: \n${error}`);
      res.status(400);
  }

    //send new data
  let data2 = get_table(get_customers);

  if (data2[1] === true) {
    let customers = data2[0];
    res.send(Customers(customers));
  } else {
    console.error(`DB get customers error: \n${data2[0]}`);
    res.status(400);
  }
});

app.delete('/customers', (req,res) => {
    // query for deleting customer
    let name = req.body["customer-delete-name"];

    let query = `
      DELETE FROM
        Customers
      WHERE 
        name = "${name}"`;

  //result of adding customer
  let result = delete_table(query);
  if (result[1] === false) {
      console.error(`DB delete Customer error: \n${error}`);
      res.status(400);
  }

    //send new data
  let data2 = get_table(get_customers);

  if (data2[1] === true) {
    let customers = data2[0];
    res.send(Customers(customers));
  } else {
    console.error(`DB get customers error: \n${data2[0]}`);
    res.status(400);
  }
});


// Invoices route
app.get('/invoices', async (req, res) => {
  //send new data
  let data2 = get_table(get_invoices);

  if (data2[1] === true) {
    let invoices = data2[0];
    res.send(Invoices(invoices));
  } else {
    console.error(`DB get invoices error: \n${data2[0]}`);
    res.status(400);
  }
});

app.post('/invoices', (req,res) => {
  // add customer
  let data = req.body;
  let customer_name = data["invoice-add-customer-name"];
  let date = data["invoice-add-date"];

  let query = `
    INSERT INTO 
      Invoices (customer_id, date) 
    VALUES 
      ((
        Select customer_id FROM Customers WHERE name = "${customer_name}"
        ), ${date}) ;`;

  //result of adding customer
  let result = insert_table(query);
  if (result[1] === false) {
      console.error(`DB Add Customer error: \n${error}`);
      res.status(400);
  }

    //send new data
  let data2 = get_table(get_invoices);
  if (data2[1] === true) {
    let invoices = data2[0];
    res.send(Invoices(invoices));
  } else {
    console.error(`DB get invoices error: \n${data2[0]}`);
    res.status(400);
  }
});

app.put('/invoices', (req,res) => {

  let invoice_id = parseInt(req.body["invoice-edit-ids"]);
  let name = req.body["invoice-edit-customer-name"];
  let date = req.body["invoice-edit-date"];

  // edit customer
  let query = `
    UPDATE Invoices 
    SET 
      customer_id = ((
        Select customer_id FROM Customers WHERE name = "${name}"
        )), 
      date = "${date}"
    WHERE 
      invoice_id = ${invoice_id}`;

  //result of editing customer
  let result = edit_table(query);
  if (result[1] === false) {
      console.error(`DB Edit invoice error: \n${error}`);
      res.status(400);
  }

  //send new data
  let data2 = get_table(get_invoices);

  if (data2[1] === true) {
    let invoices = data2[0];
    res.send(Invoices(invoices));
  } else {
    console.error(`DB get invoices error: \n${data2[0]}`);
    res.status(400);
  }
});

app.delete('/invoices', (req,res) => {
  // query for deleting customer
  let invoice_id = parseInt(req.body["invoice-edit-ids"]);

  let query = `
    DELETE FROM
      Invoices
    WHERE 
      invoice_id = "${invoice_id}"`;

//result of adding customer
let result = delete_table(query);
if (result[1] === false) {
    console.error(`DB delete Invoice error: \n${error}`);
    res.status(400);
}

  //send new data
  let data2 = get_table(get_invoices);
  if (data2[1] === true) {
    let invoices = data2[0];
    res.send(Invoices(invoices));
  } else {
    console.error(`DB get invoices error: \n${data2[0]}`);
    res.status(400);
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




const get_table = async (query) => {
  try {

    //get the data
    db.pool.query(query, function(error, rows, fields) {
      if (error) {
        return [error, false];
      }
      let customers = rows;
      return [rows, true];
    });
  } catch (err) {
    return [err, false];
  }
};

const insert_table = async (query) => {
  try {

    //insert the query
    db.pool.query(query, function(error, rows, fields) {
      if (error) {
        return [error, false];
      }
      return [rows, true];
    });
  } catch (err) {
    return [err, false];
  }
};

const edit_table = async (query) => {
  try {

    //edit the table
    db.pool.query(query, function(error, rows, fields) {
      if (error) {
        return [error, false];
      }
      return [rows, true];
    });
  } catch (err) {
    return [err, false];
  }
};


const delete_table = async (query) => {
  try {

    //deleting the row
    db.pool.query(query, (error, rows, fields) => {
      if (error) {
        return [error, false];
      }
      return [rows, true];
    });
  } catch (err) {
    return [err, false];
  }
};