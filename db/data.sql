/*
CS-340
Group 45
Jeffrey Valcher, Jawad Abdullah
Sample data manipulation queries
*/

/*
    Customers
*/

-- Query for searching a specific customer
SELECT * FROM Customers;
SELECT * FROM Customers 
    WHERE name = :name;
SELECT * FROM Customers 
    WHERE name = :name AND level = :level;


-- Query for adding a new customer functionality with colon : character being used to 
-- denote the variables that will have data from the backend programming language
INSERT INTO Customers
    (name, level)
VALUES
    (:name, :level);


--Query for updating a specfic customer's information
UPDATE Customers
    SET level = :level
    WHERE name = :name;


--Query for deleting a specific customer's information
DELETE FROM Customers WHERE name = :name;


/*
    Weapon queries
*/

-- Query for searching a specific customer
SELECT * FROM Weapons;
SELECT * FROM Weapons 
    WHERE name = :name;
SELECT * FROM Weapons 
    WHERE level = :level AND total_cost <= :total_cost;


-- Query for adding a new customer functionality with colon : character being used to 
-- denote the variables that will have data from the backend programming language
INSERT INTO Weapons
    (name, level, total_cost)
VALUES
    (:name, :level, :total_cost);


--Query for updating a specfic customer's information
UPDATE Weapons
    SET level = :level
    WHERE name = :name;


--Query for deleting a specific customer's information
DELETE FROM Weapons 
    WHERE name = :name;


/*
    Materials
*/

-- Query for searching a specific customer
SELECT * FROM Materials;
SELECT * FROM Materials WHERE name = :name;
SELECT * FROM Materials WHERE name = :name AND pounds_available = :pounds_available;
SELECT * FROM Materials 
    WHERE cost_per_pound = :cost_per_pound 
    AND pounds_available = :pounds_available;


-- Query for adding a new customer functionality with colon : character being used to 
-- denote the variables that will have data from the backend programming language
INSERT INTO Materials
    (name, pounds_available, cost_per_pound)
VALUES
    (:name, :pounds_available, :cost_per_pound);


--Query for updating a specfic customer's information
UPDATE Materials
    SET cost_per_pound = :cost_per_pound
    WHERE name = :name;


--Query for deleting a specific customer's information
DELETE FROM Materials WHERE name = :name;

/*
    Sales
*/

-- Query for searching a specific sale
SELECT * FROM Sales;
SELECT * FROM Sales
    INNER JOIN Invoices ON Sales.invoice_id = Invoices.invoice_id
    INNER JOIN Customers ON Invoices.customer_id = Customers.customer_id;
SELECT * FROM Sales WHERE price = :price;


-- Query for adding a new sales functionality with colon : character being used to 
-- denote the variables that will have data from the backend programming language
INSERT INTO Sales
    (sale_id, invoice_id, weapon_id, price)
VALUES
    (:sale_id, :invoice_id, :weapon_id, :price);


--Query for updating a specfic sale's price
UPDATE Sales
    SET price = :price
    WHERE weapon_id = (SELECT weapon_id FROM Weapons WHERE name=:name);


--Query for deleting a specific sale's information
DELETE FROM Sales WHERE price = :price;


/*
    Invoices
*/

-- Invoice queries
SELECT * FROM Invoices;
SELECT * FROM Invoices
    INNER JOIN Customers ON Invoices.customer_id = Customers.customer_id
    WHERE Customers.customer_name = :name;

-- Add new invoice with sales
INSERT INTO Invoices
    (invoice_id, total_price, date)
VALUES
    (:invoice_id, :total_price, :date);
    
    
INSERT INTO Invoices
    (customer_id)



/*
    WeaponMaterials
*/

-- Query for searching a specific sale
SELECT * FROM Sales;
SELECT * FROM Sales
    INNER JOIN Invoices ON Sales.invoice_id = Invoices.invoice_id
    INNER JOIN Customers ON Invoices.customer_id = Customers.customer_id;
SELECT * FROM Sales WHERE price = :price;


-- Query for adding a new sales functionality with colon : character being used to 
-- denote the variables that will have data from the backend programming language
INSERT INTO Sales
    (sale_id, invoice_id, weapon_id, price)
VALUES
    (:sale_id, :invoice_id, :weapon_id, :price);


--Query for updating a specfic sale's price
SELECT weapon_id FROM Weapons WHERE name=:name;
UPDATE Sales
    SET price = :price
    WHERE weapon_id = weapon_id;


--Query for deleting a specific sale's information
DELETE FROM Sales WHERE price = :price;

