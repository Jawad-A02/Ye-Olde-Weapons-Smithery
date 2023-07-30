const express = require("express");
const app = express();

PORT = 61178;

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
    res.send(Customers());
  } catch (err) {
    console.log(`GET / ERROR: \n${err}`);
    res.status(500);
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
