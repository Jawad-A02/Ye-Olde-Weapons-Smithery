/*
CS-340
Group 45
Jeffrey Valcher, Jawad Abdullah
Sample data manipulation queries
*/

/*
    Customers
*/

-- populate table
SELECT 
    customer_id,
    NAMES,
    level
FROM Customers;


-- create new customer
INSERT INTO Customers
    (name, level)
VALUES
    (:name, :level);

-- update existing customer name, level
UPDATE Customers
    SET level = :level, name = :name
    WHERE customer_id = :customer_id;

-- delete customer
DELETE FROM Customers WHERE name = :name;

-- update form dropdowns dynamically
SELECT level FROM Customers;
SELECT customer_id FROM Customers;
SELECT name from Customers;


/*
    Weapon queries
*/

-- populate table
SELECT * FROM Weapons;

-- add new weapon
INSERT INTO Weapons
    (name, level, magical_ability, total_cost)
VALUES
    (:name, :level, :magical_ability, :total_cost);

-- update existing weapon
UPDATE Weapons
    SET name = :name, level = :level, magical_ability = :magical_ability, total_cost = :total_cost
    WHERE weapon_id = :weapon_id;

-- delete weapon 
DELETE FROM Weapons 
    WHERE weapon_id = :weapon_id;

-- update drowpdowns
SELECT level FROM Weapons;
SELECT weapon_id FROM Weapons;


/*
    Materials
*/

-- populate table
SELECT 
    material_id,
    name,
    pounds_available,
    cost_per_pound as "Cost per Pound"
FROM Materials;


-- add new material
INSERT INTO Materials
    (name, pounds_available, cost_per_pound)
VALUES
    (:name, :pounds_available, :cost_per_pound);

-- update existing material
UPDATE Materials
    SET name = :name, pounds_available = :pounds_available, cost_per_pound = :cost_per_pound
    WHERE material_id = :material_id;

-- delete weapon 
DELETE FROM Materials
    WHERE material_id = :material_id;

-- update dropdowns dynamically
SELECT material_id from Materials;

/*
    Sales
*/

-- Populate Table
SELECT
    s.sale_id,
    s.invoice_id,
    w.name,
    s.price
FROM Sales s
INNER JOIN Weapons w
    ON s.weapon_id = w.weapon_id;
    
-- populate the weapon's not assoicated with a sale
SELECT name
  FROM Weapons
LEFT JOIN Sales ON Weapons.weapon_id = Sales.weapon_id
  WHERE Sales.weapon_id IS NULL;

-- add new sale
INSERT INTO Sales
    (invoice_id, weapon_id, price)
VALUES
    (:invoice_id, (SELECT weapon_id FROM Weapons WHERE name = :weapon_name), :price);

-- update existing sale
UPDATE Sales
    SET price = :price, 
    weapon_id = (SELECT weapon_id FROM Weapons WHERE name = :weapon_name), invoice_id = :invoice_id
    WHERE sale_id = :sale_id;

-- delete sale
DELETE FROM Sales WHERE sale_id = :sale_id;

-- update dropdowns
SELECT invoice_id FROM Invoices;
SELECT weapon_id FROM Invoices;
SELECT sale_id FROM Sales;

/*
    Invoices
*/

-- Populate table
SELECT Invoices.invoice_id, Customers.name, 
    Invoices.date, Invoices.total_price
FROM Invoices
LEFT JOIN Sales ON Invoices.invoice_id = Sales.invoice_id
LEFT JOIN Customers ON Invoices.customer_id = Customers.customer_id
GROUP BY Invoices.invoice_id, Invoices.total_price;

-- Add new invoice
INSERT INTO Invoices
    (customer_id, date)
VALUES
    ((Select customer_id FROM Customers WHERE name = :customer_name), :date);
    
-- Update Existing invoices
UPDATE Invoices
    SET customer_id = (Select customer_id FROM Customers WHERE name = :customer_name), data = :date
    WHERE invoice_id = :invoice_id;

-- Delete an Invoice
DELETE FROM Inoivces WHERE invoice_id = :invoice_id;

-- update dropdowns
SELECT invoice_id FROM Invoices;


/*
    WeaponMaterials
*/

-- Populate Weapon Materials
  SELECT 
      w.Name AS weaponName,
      m.Name AS materialName,
      wm.pounds_used
  FROM WeaponMaterials wm
  JOIN Weapons w
      ON wm.weapon_id = w.weapon_id
  JOIN Materials m
      ON wm.material_id = m.material_id;


-- Add new Weapon Materials
    INSERT INTO WeaponMaterials
      (weapon_id, material_id, pounds_used)
    VALUES ( 
      (SELECT weapon_id FROM Weapons WHERE name = :weapon_name), 
      (SELECT material_id FROM Materials WHERE name = :material_name), 
      ${pounds});

-- Update Existing Weapon Materials
    UPDATE 
      WeaponMaterials
    SET 
      material_id = 
        (SELECT material_id FROM Materials WHERE name = :material_name), 
      pounds = ${pounds}
    WHERE 
      weapon_id = 
        (SELECT weapon_id FROM Weapons WHERE name = :weapon_name);

-- Delete a Weapon Materials
DELETE FROM
      WeaponMaterials
    WHERE 
      weapon_id = (SELECT weapon_id FROM Weapons WHERE name = :weapon_name) 
    AND 
      material_id = (SELECT material_id FROM Materials WHERE name = :material_name)

