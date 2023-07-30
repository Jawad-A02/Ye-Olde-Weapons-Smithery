/*

DDL: Ye Olde Weapons Smithery
--------
Group 45
Jeffrey Valcher, Jawad Abdullah

*/

SET FOREIGN_KEY_CHECKS = 0;
SET AUTOCOMMIT = 0;

-- Create Customers table
DROP TABLE IF EXISTS Customers;
CREATE TABLE Customers (
    customer_id INT(11) UNIQUE NOT NULL AUTO_INCREMENT,
    name VARCHAR(45) UNIQUE NOT NULL,
    level INT NOT NULL,
    PRIMARY KEY (customer_id)
);

-- Create Materials table
DROP TABLE IF EXISTS Materials;
CREATE TABLE Materials (
    material_id INT(11) UNIQUE NOT NULL AUTO_INCREMENT,
    name VARCHAR(45) UNIQUE NOT NULL,
    pounds_available INT(11) NOT NULL,
    cost_per_pound DECIMAL(10,2) NOT NULL,
    PRIMARY KEY (material_id)
);

-- Create Weapons table
DROP TABLE IF EXISTS Weapons;
CREATE TABLE Weapons (
    weapon_id INT(11) UNIQUE NOT NULL AUTO_INCREMENT,
    name VARCHAR(45) UNIQUE NOT NULL,
    level INT(11) NOT NULL,
    magical_ability VARCHAR(145) NOT NULL,
    total_cost DECIMAL(10,2) NOT NULL,
    PRIMARY KEY (weapon_id)
);

-- Create WeaponMaterials intersection table
DROP TABLE IF EXISTS WeaponMaterials;
CREATE TABLE WeaponMaterials (
    weapon_id INT(11),
    material_id INT(11),
    pounds_used INT(11),
    FOREIGN KEY (weapon_id) REFERENCES Weapons (weapon_id)
        ON DELETE SET NULL,
    FOREIGN KEY (material_id) REFERENCES Materials (material_id)
        ON DELETE SET NULL
);

-- Create Sales table
DROP TABLE IF EXISTS Sales;
CREATE TABLE Sales (
    sale_id INT(11) UNIQUE NOT NULL AUTO_INCREMENT,
    invoice_id INT(11) NOT NULL,
    weapon_id INT(11),
    price DECIMAL(10,2) NOT NULL,
    PRIMARY KEY (sale_id),
    FOREIGN KEY (invoice_id) REFERENCES Invoices (invoice_id)
        ON DELETE CASCADE,
    FOREIGN KEY (weapon_id) REFERENCES Weapons (weapon_id)
        ON DELETE SET NULL
);

-- Create Invoices table
DROP TABLE IF EXISTS Invoices;
CREATE TABLE Invoices (
    invoice_id INT(11) UNIQUE NOT NULL AUTO_INCREMENT,
    customer_id INT(11),
    total_price DECIMAL(10,2) NOT NULL,
    date DATE NOT NULL,
    PRIMARY KEY (invoice_id),
    FOREIGN KEY (customer_id) REFERENCES Customers (customer_id)
        ON DELETE SET NULL
);

-- Insert sample data into Customers table
INSERT INTO Customers 
    (customer_id, name, level)
VALUES
    (1, "Akame", 10),
    (2, "Nova", 7),
    (3, "Dash", 3);

-- Insert sample data into Materials table
INSERT INTO Materials 
    (material_id, name, pounds_available, cost_per_pound)
VALUES 
    (1, "steel", 100, 20),
    (2, "wood", 100, 10),
    (3, "gold", 10, 60),
    (4, "ruby", 5, 75);

-- Insert sample data int Weapons table
INSERT INTO Weapons 
    (weapon_id, name, level, magical_ability, total_cost)
VALUES 
    (1, "Great Sword", 1, "Increase max health by 5%", 180),
    (2, "Crossbow", 3, "Engulf arrows in fire", 165),
    (3, "Axe", 2, "Destroy Shields", 110),
    (4, "Boomerang", 3, "Freeze surroundings", 85);

-- Insert sample data into WeaponMaterials intersection table
INSERT INTO WeaponMaterials 
    (weapon_id, material_id, pounds_used)
VALUES
    (1, 1, 5),
    (1, 2, 2),
    (1, 3, 1),
    (2, 1, 3),
    (2, 2, 3),
    (2, 4, 1),
    (3, 1, 4),
    (3, 2, 3),
    (4, 2, 1),
    (4, 4, 1);

-- Insert sample data into Sales table
INSERT INTO Sales 
    (sale_id, invoice_id, weapon_id, price)
VALUES 
    (1, 1, 3, 300.25),
    (2, 1, 2, 275.50),
    (3, 2, 1, 150.00),
    (4, 3, 4, 100.75);

-- Insert sample data into Invoices table
INSERT INTO Invoices 
    (invoice_id, date, total_price, customer_id)
VALUES 
    (1, '1200-10-07', 575.75, 1),
    (2, '1200-07-05', 150.00, 3),
    (3, '1200-04-03', 100.75, 2);


SET FOREIGN_KEY_CHECKS=1;
COMMIT;
