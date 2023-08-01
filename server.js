const express = require("express");
const app = express();
var methodOverride = require('method-override');
const util = require('util');


PORT = 61178;

// database
const db = require('./db/db-connector.js')
const queryPromise = util.promisify(db.pool.query).bind(db.pool);
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

// get customers page
app.get('/customers', async (req, res) => {
  let data2 = await get_table(get_customers);
  if (data2) {
     res.send(Customers(data2));
  } else {
    res.status(400);
  }
});

app.post('/customers', async (req,res) => {
  // add customer
  let data = req.body;
  let level = parseInt(data["customer-add-level"]);
  let name = data["customer-add-name"];

  // add customer
  let query = `
    INSERT INTO 
      Customers (name, level) 
    VALUES 
      ("${name}", ${level}) ;`;
  await insert_table(query);

  //send updated page
  let data2 = await get_table(get_customers);
  if (data2) {
     res.send(Customers(data2));
  } else {
    res.status(400);
  }
});

app.put('/customers', async (req,res) => {

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
  await edit_table(query);

  //send new data
  let data2 = await get_table(get_customers);
  if (data2) {
     res.send(Customers(data2));
  } else {
    res.status(400);
  }
});

app.delete('/customers', async (req,res) => {
  // query for deleting customer
  let name = req.body["customer-delete-name"];

  // delete customer
  let query = `
    DELETE FROM
      Customers
    WHERE 
      name = "${name}"`;
  await delete_table(query);

  //send new data
  let data2 = await get_table(get_customers);
  if (data2) {
     res.send(Customers(data2));
  } else {
    res.status(400);
  }
});

/**********
  Invoices
 **********/


// Invoices route
app.get('/invoices', async (req, res) => {
  //send new data
  let data2 = get_table(get_invoices);

  if (data2) {
    res.send(Invoices(data2));
 } else {
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

  console.log(`DATE: ${data}`);

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
  let invoice_id = parseInt(req.body["invoice-delete-ids"]);

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


//get the data
const get_table = async (query) => {
  try {
    const rows = await queryPromise(query);
    return rows;
  } catch (error) {
    console.error(`get_table error: ${error}`);
    throw error; // Re-throw the error to be caught in the route handler
  }
};

// insert data into table
const insert_table = async (query) => {
  try {
    const rows = await queryPromise(query);
    return rows;
  } catch (error) {
    console.error(`insert_table error: ${error}`);
    return undefined; // Re-throw the error to be caught in the route handler
  }
};

const edit_table = async (query) => {
  try {
    const rows = await queryPromise(query);
    return;
  } catch (error) {
    console.error(`edit_table error: ${error}`);
    throw error; // Re-throw the error to be caught in the route handler
  }
};


const delete_table = async (query) => {
  try {
    const rows = await queryPromise(query);
    return;
  } catch (error) {
    console.error(`get_table error: ${error}`);
    throw error; // Re-throw the error to be caught in the route handler
  }
};
