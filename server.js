const express = require("express");
const app = express();
const methodOverride = require('method-override');
const util = require('util');

const PORT = 61178;

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



/************************
  Get table data queries
 ************************/

// Select queries
const get_customers = `
    SELECT 
      customer_id, name, level 
    FROM 
      Customers;
`;

const get_invoices = `
    SELECT 
      Invoices.invoice_id, 
      Customers.name, 
      Invoices.date, 
      COALESCE(SUM(Sales.price), 0) as total_price
    FROM Invoices
      LEFT JOIN Sales ON Invoices.invoice_id = Sales.invoice_id
      LEFT JOIN Customers ON Invoices.customer_id = Customers.customer_id
    GROUP BY Invoices.invoice_id;
`;

const get_weapons = `SELECT * FROM Weapons`;

const get_materials = `
  SELECT 
      material_id,
      name,
      pounds_available,
      cost_per_pound as "Cost per Pound"
  FROM Materials;
`;

const get_sales = `
  SELECT
      s.sale_id,
      s.invoice_id,
      w.name,
      s.price
  FROM Sales s
  LEFT JOIN Weapons w
      ON s.weapon_id = w.weapon_id;
`;

const get_sale_weapons = `
  SELECT name
  FROM Weapons
  LEFT JOIN Sales 
    ON Weapons.weapon_id = Sales.weapon_id
  WHERE Sales.weapon_id IS NULL;
`;

const get_weapon_materials = `
  SELECT 
      w.Name AS weaponName,
      m.Name AS materialName,
      wm.pounds_used
  FROM WeaponMaterials wm
  LEFT JOIN Weapons w
      ON wm.weapon_id = w.weapon_id
  LEFT JOIN Materials m
      ON wm.material_id = m.material_id
  ORDER BY w.Name ASC;
`;




/********
 ********
  Routes
 ********
 ********/


/***********
  Home page 
 ***********/

app.get(['/', '/home'], async (req, res) => {
  try {

    res.send(Home());
  } catch (err) {
    console.log(`GET / ERROR: \n${err}`);
    res.status(500);
  }
});

/***********
  Customers
 ***********/

// get customers page
app.get('/customers', async (req, res) => {
  let data2 = await get_table(get_customers);
  if (data2) {
     res.send(Customers(data2));
  } else {
    res.status(400);
  }
});

// add customer
app.post('/customers', async (req,res) => {

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

// edit customer
app.put('/customers', async (req,res) => {

  let customer_id = parseInt(req.body["customer-edit-id"]);
  let name = req.body["customer-edit-name"];
  let level = parseInt(req.body["customer-edit-level"]);

  let query = `
  UPDATE Customers 
  SET 
    level = ${level}, 
    name = CASE
      WHEN "${name}" = '' THEN name
      ELSE "${name}"
  END
  WHERE 
    customer_id = ${customer_id};
  `;
  await edit_table(query);

  //send new page
  let data2 = await get_table(get_customers);
  if (data2) {
     res.send(Customers(data2));
  } else {
    res.status(400);
  }
});

// delete customer
app.delete('/customers', async (req,res) => {
  
  let name = req.body["customer-delete-name"];

  // delete customer
  let query = `
    DELETE FROM
      Customers
    WHERE 
      name = "${name}"`;
  await delete_table(query);

  //send new page
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

// get invoices page
app.get('/invoices', async (req, res) => {
  
   //send new data
  const invoiceData = await get_table(get_invoices);
  const customerData = await get_table(get_customers);

  if (invoiceData) {
    res.send(Invoices(invoiceData, customerData));
} else {
   res.status(400);
}
});

// add invoice
app.post('/invoices', async (req,res) => {
  // add invoice
  let data = req.body;
  let customer_name = data["invoice-add-customer-name"];
  let date = data["invoice-add-date"];

  let query = `
    INSERT INTO 
      Invoices (customer_id, date) 
    VALUES (
      (SELECT customer_id FROM Customers WHERE name = "${customer_name}"),      
      "${date}"
      );
  `;

  //result of adding invoice
  await insert_table(query);

  //send new data
  const invoiceData = await get_table(get_invoices);
  const customerData = await get_table(get_customers);

  if (invoiceData) {
    res.send(Invoices(invoiceData, customerData));
  } else {
   res.status(400);
}
});

// edit invoice
app.put('/invoices', async (req,res) => {

  let invoice_id = parseInt(req.body["invoice-edit-ids"]);
  let name = req.body["invoice-edit-customer-name"];
  let date = req.body["invoice-edit-date"];

  const dateQuery = date ?  `, date = "${date}"` : "";

  // edit invoice
  let query = `

    UPDATE 
      Invoices 
    SET 
      customer_id = (SELECT customer_id FROM Customers WHERE name = "${name}")
      ${dateQuery}
    WHERE invoice_id = ${invoice_id};
  `;

  //result of editing invoice
  await edit_table(query);

  //send new data
  const invoiceData = await get_table(get_invoices);
  const customerData = await get_table(get_customers);

  if (invoiceData) {
    res.send(Invoices(invoiceData, customerData));
  } else {
    res.status(400);
  }
});

// delete invoice
app.delete('/invoices', async (req,res) => {
  
  let invoice_id = parseInt(req.body["invoice-delete-ids"]);

  // delete invoice
  let query = `
    DELETE FROM
      Invoices
    WHERE 
      invoice_id = "${invoice_id}"
  `;
  await delete_table(query);

  //send new data
  const invoiceData = await get_table(get_invoices);
  const customerData = await get_table(get_customers);

  if (invoiceData) {
    res.send(Invoices(invoiceData, customerData));
  } else {
    res.status(400);
  }
});


/*******
  Sales
 *******/


// get sales page
app.get('/sales', async (req, res) => {
  
  //send new data
  let salesData = await get_table(get_sales);
  let weaponData = await get_table(get_sale_weapons);
  let invoiceData = await get_table(get_invoices);

  if (salesData) {
    res.send(Sales(salesData, weaponData, invoiceData));
} else {
      res.status(400);
  }
});

// add sale
app.post('/sales', async (req,res) => {

  let data = req.body;
  let invoice_id = parseInt(data["sale-add-invoice-id"]);
  let weapon_name = data["sale-add-weapon-name"];
  let price = parseFloat(data["sale-add-price"]);

  // add sale
  let query = `
    INSERT INTO Sales
        (invoice_id, weapon_id, price)
    VALUES (
        ${invoice_id},
        (SELECT weapon_id FROM Weapons WHERE name = "${weapon_name}"),   
        ${price});
  `;
  await insert_table(query);

  //send new data
  let salesData = await get_table(get_sales);
  let weaponData = await get_table(get_sale_weapons);
  let invoiceData = await get_table(get_invoices);

  if (salesData) {
    res.send(Sales(salesData, weaponData, invoiceData));
  } else {
    res.status(400);
  }
});

// edit sale
app.put('/sales', async (req,res) => {

  let sale_id = parseInt(req.body["sale-edit-sale-id"]);
  let invoice_id = parseInt(req.body["sale-edit-invoice-id"]);
  let weapon_name = req.body["sale-edit-weapon-name"];
  let price = undefined;
  if (req.body["sale-edit-price"] === "") {
    price = "";
  }else { 
    price = parseFloat(req.body["sale-edit-price"]);
  }

  const priceQuery = price === "" ? "" : `, price = ${price}`;
  const wnameQuery = !weapon_name ? "" : `, weapon_id = (SELECT weapon_id FROM Weapons WHERE name = "${weapon_name}")`

  // edit invoice
  let query = `
    UPDATE Sales
    SET 
      invoice_id = ${invoice_id}
      ${wnameQuery}
      ${priceQuery}
    WHERE 
      sale_id = ${sale_id};
  `;

  //result of editing sale
  await edit_table(query);

  //send new data
  let salesData = await get_table(get_sales);
  let weaponData = await get_table(get_sale_weapons);
  let invoiceData = await get_table(get_invoices);

  if (salesData) {
    res.send(Sales(salesData, weaponData, invoiceData));
} else {
    res.status(400);
  }
});

// delete sales
app.delete('/sales', async (req,res) => {
  
  let sale_id = parseInt(req.body["sale-delete-ids"]);

  // delete sale
  let query = `
    DELETE FROM
      Sales
    WHERE 
      sale_id = "${sale_id}"`;
  await delete_table(query);

  //send new page
  let salesData = await get_table(get_sales);
  let weaponData = await get_table(get_sale_weapons);
  let invoiceData = await get_table(get_invoices);

  if (salesData) {
    res.send(Sales(salesData, weaponData, invoiceData));
} else {
    res.status(400);
  }
});


/**********
  Materials
 **********/

// get materials page
app.get('/materials', async (req, res) => {
  
  //send new data
  let data2 = await get_table(get_materials);

  if (data2) {
    res.send(Materials(data2));
 } else {
   res.status(400);
}
});

// add material
app.post('/materials', async (req,res) => {
  // add material
  let data = req.body;
  let material_name = data["material-add-name"];
  let pounds = parseInt(data["material-add-pounds"]);
  let cost = parseFloat(data["material-add-cost"]);

  let query = `
    INSERT INTO Materials
      (name, pounds_available, cost_per_pound)
    VALUES
      ("${material_name}", ${pounds}, ${cost});
  `;
  
  //result of adding material
  await insert_table(query);

  //send new data
  let data2 = await get_table(get_materials);

  if (data2) {
    res.send(Materials(data2));
  } else {
   res.status(400);
}
});

// edit material
app.put('/materials', async (req,res) => {
  
  let material_id = parseInt(req.body["material-edit-ids"]);
  let material_name = req.body["material-edit-name"];
  let pounds = undefined;
  let cost = undefined;

  if (req.body["material-edit-pounds"] === "") {
    pounds = "";
  }else { 
    pounds = parseInt(req.body["material-edit-pounds"]);
  }
  if (req.body["material-edit-cost"] === "") {
    cost = "";
  }else { 
    cost = parseFloat(req.body["material-edit-cost"]);
  }

  const pounds_query = pounds === "" ? "" : `, pounds_available = ${pounds}`;
  const cost_query = cost === "" ? "" : `, cost_per_pound = ${cost}`;
  // edit material
  let query = `
  UPDATE Materials
    SET name = CASE
      WHEN "${material_name}" = "" THEN name
      ELSE "${material_name}"
    END
    ${pounds_query}
    ${cost_query}
  WHERE material_id = ${material_id}`;
  //result of editing material
  await edit_table(query);

  //send new data
  let data2 = await get_table(get_materials);

  if (data2) {
    res.send(Materials(data2));
  } else {
   res.status(400);
}
});

// delete Material
app.delete('/materials', async (req,res) => {
  
  let material_name = req.body["material-delete-name"];

  // delete customer
  let query = `
    DELETE FROM
      Materials
    WHERE 
      name = "${material_name}"`;
  await delete_table(query);

  //send new page
  let data2 = await get_table(get_materials);
  if (data2) {
  res.send(Materials(data2));
  } else {
  res.status(400);
  }
});


/*********
  Weapons
 *********/

// get weapons page
app.get('/weapons', async (req, res) => {
  let data2 = await get_table(get_weapons);
  if (data2) {
     res.send(Weapons(data2));
  } else {
    res.status(400);
  }
});

// add weapon
app.post('/weapons', async (req,res) => {

  let data = req.body;
  let name = data["weapon-add-name"];
  let level = parseInt(data["weapon-add-level"]);
  let magic = data["weapon-add-magic"];
  let cost = parseFloat(data["weapon-add-cost"]);

  // add weapon
  let query = `
    INSERT INTO Weapons
      (name, level, magical_ability, total_cost)
    VALUES
      ("${name}", ${level}, "${magic}", ${cost});
  `;
  await insert_table(query);

  //send updated page
  let data2 = await get_table(get_weapons);
  if (data2) {
     res.send(Weapons(data2));
  } else {
    res.status(400);
  }
});

// edit weapon
app.put('/weapons', async (req,res) => {

  let weapon_id = parseInt(req.body["weapon-edit-weapon-id"]);
  let name = req.body["weapon-edit-name"];
  let level = parseInt(req.body["weapon-edit-level"]);
  let magic = req.body["weapon-edit-magic"];
  let cost = undefined;

  if (req.body["weapon-edit-cost"] === "") {
    cost = "";
  }else { 
    cost = parseFloat(req.body["weapon-edit-cost"]);
  }

  const cost_query = cost === "" ? "" : `, total_cost = ${cost}`;
  // edit weapon
  let query = `
    UPDATE Weapons 
    SET 
      level = ${level}, 
      name = CASE 
        WHEN "${name}" = "" THEN name
        ELSE "${name}"
      END,
      magical_ability = CASE
        WHEN "${magic}" = "" THEN magical_ability
        ELSE "${magic}"
      END
      ${cost_query}
    WHERE 
      weapon_id = ${weapon_id};`;
  await edit_table(query);

  //send new page
  let data2 = await get_table(get_weapons);
  if (data2) {
     res.send(Weapons(data2));
  } else {
    res.status(400);
  }
});

// delete weapon
app.delete('/weapons', async (req,res) => {

  let name = req.body["weapon-delete-name"];

  // delete customer
  let query = `
    DELETE FROM
      Weapons
    WHERE 
      name = "${name}";
  `;
  await delete_table(query);

  //send new page
  let data2 = await get_table(get_weapons);
  if (data2) {
     res.send(Weapons(data2));
  } else {
    res.status(400);
  }
});





/******************
  Weapon Materials
 ******************/


// get weaponsmaterials page
app.get('/weaponmaterials', async (req, res) => {

  let weapMatData = await get_table(get_weapon_materials);
  let weaponData = await get_table(get_weapons);
  let materialData = await get_table(get_materials);

  if (weaponData) {
     res.send(WeaponMaterials(weapMatData, weaponData, materialData));
  } else {
    res.status(400);
  }
});

// add weapon material
app.post('/weaponmaterials', async (req,res) => {

  let data = req.body;
  let weapon_name = data["weapmat-add-weapon-name"];
  let material_name = data["weapmat-add-material-name"];
  let pounds = parseInt(data["weapmat-add-pounds"]);

  // add weapon materials
  let query = `
    INSERT INTO WeaponMaterials
      (weapon_id, material_id, pounds_used)
    VALUES ( 
      (SELECT weapon_id FROM Weapons WHERE name = "${weapon_name}"), 
      (SELECT material_id FROM Materials WHERE name = "${material_name}"), 
      ${pounds});
  `;
  await insert_table(query);

  //send updated page
  let weapMatData = await get_table(get_weapon_materials);
  let weaponData = await get_table(get_weapons);
  let materialData = await get_table(get_materials);

  if (weaponData) {
     res.send(WeaponMaterials(weapMatData, weaponData, materialData));
} else {
    res.status(400);
  }
});

// edit weapon material
app.put('/weaponmaterials', async (req,res) => {

  let weapon_name = req.body["weapmat-edit-weapon-name"];
  let material_name = req.body["weapmat-edit-material-name"];
  let pounds = undefined;

  if (req.body["weapmat-edit-pounds"] === "") {
    pounds = "";
  }else { 
    pounds = parseInt(req.body["weapmat-edit-pounds"]);
  }

  const pounds_query = pounds === "" ? "" : `, pounds_used = ${pounds}`;
  // edit customer
  let query = `
    UPDATE 
      WeaponMaterials
    SET 
      material_id = 
        (SELECT material_id FROM Materials WHERE name = "${material_name}")
      ${pounds_query}
    WHERE 
      weapon_id = 
        (SELECT weapon_id FROM Weapons WHERE name = "${weapon_name}")
      AND 
      material_id = 
        (SELECT material_id FROM Materials WHERE name = "${material_name}");
  `;
  await edit_table(query);

  //send new page
  let weapMatData = await get_table(get_weapon_materials);
  let weaponData = await get_table(get_weapons);
  let materialData = await get_table(get_materials);

  if (weaponData) {
     res.send(WeaponMaterials(weapMatData, weaponData, materialData));
} else {
    res.status(400);
  }
});

// delete weaponMaterials
app.delete('/weaponmaterials', async (req,res) => {
  
  let weapon_name = req.body["weapmat-delete-weapon-name"];
  let material_name = req.body["weapmat-delete-material-name"]

  // delete customer
  let query = `
    DELETE FROM
      WeaponMaterials
    WHERE 
      weapon_id = (SELECT weapon_id FROM Weapons WHERE name = "${weapon_name}") 
    AND 
      (material_id is NULL or material_id = (SELECT material_id FROM Materials WHERE name = "${material_name}"));
  `;
  await delete_table(query);

  //send new page
  let weapMatData = await get_table(get_weapon_materials);
  let weaponData = await get_table(get_weapons);
  let materialData = await get_table(get_materials);

  if (weaponData) {
     res.send(WeaponMaterials(weapMatData, weaponData, materialData));
} else {
    res.status(400);
  }
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
    await queryPromise(query);
  } catch (error) {
    console.error(`edit_table error: ${error}`);
    throw error; // Re-throw the error to be caught in the route handler
  }
};


const delete_table = async (query) => {
  try {
    await queryPromise(query);
  } catch (error) {
    console.error(`get_table error: ${error}`);
    throw error; // Re-throw the error to be caught in the route handler
  }
};


app.listen(PORT, (err) => {
  if (err) console.log(`Express listen error: \n${err}`);
  else console.log(`Server running on port ${PORT}`);
})
