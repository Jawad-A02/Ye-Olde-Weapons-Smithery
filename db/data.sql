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
SELECT * FROM Customers;

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


/*
    Materials
*/

-- populate table
SELECT * FROM Customers;

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

/*
    Sales
*/

-- Populate Table
SELECT * FROM Sales;
    
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


/*
    Invoices
*/

-- Populate table
SELECT * FROM Invoices;

-- Add new invoice
INSERT INTO Invoices
    (customer_id, date)
VALUES
    (:customer_id, :date);
    
-- Update Existing invoices
UPDATE Invoices
    SET customer_id = :customer_id, data = :date
    WHERE invoice_id = :invoice_id;

-- Delete an Invoice
DELETE FROM Inoivces WHERE invoice_id = invoice_id;



/*
    WeaponMaterials
*/

-- Populate Weapon Materials
SELECT * FROM WeaponMaterials;

-- Add new Weapon Materials
INSERT INTO WeaponMaterials
    (weapon_id, material_id, pounds)
VALUES 
    (:weapon_id, :material_id, :pounds);

-- Update Existing Weapon Materials
UPDATE Invoices
    SET material_id = :material_id, pounds = :pounds
    WHERE weapon_id = :weapon_id;

-- Delete a Weapon Materials
DELETE FROM WeaponMaterials WHERE weapon_id = :weapon_id AND material_id = :material_id;


