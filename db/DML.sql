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
    cost_per_pound
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
    
-- add new sale
INSERT INTO Sales
    (invoice_id, weapon_id, price)
VALUES
    (:invoice_id, :weapon_id, :price);

-- update existing sale
UPDATE Sales
    SET price = :price, weapon_id = weapon_id, invoice_id = :invoice_id
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
    Invoices.date, SUM(Sales.price)
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
    w.name,
    m.name,
    wm.pounds_used
FROM WeaponMaterials wm
JOIN Weapons w
    ON wm.weapon_id = w.weapon_id
JOIN Materials m
    ON wm.material_id = m.material_id;


-- Add new Weapon Materials
INSERT INTO WeaponMaterials
    (weapon_id, material_id, pounds)
VALUES 
    (:weapon_id, :material_id, :pounds);

-- Update Existing Weapon Materials
UPDATE WeaponMaterials
    SET material_id = :material_id, pounds = :pounds
    WHERE weapon_id = :weapon_id;

-- Delete a Weapon Materials
DELETE FROM WeaponMaterials WHERE weapon_id = :weapon_id AND material_id = :material_id;

-- update dropdowns
SELECT weapon_id FROM WeaponMaterials;
SELECT material_id FROM WeaponMaterials;
