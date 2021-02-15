-- Create a local db user in order for the backend to be able to access the data.
drop user if exists 'admin'@'localhost';
create user 'admin'@'localhost' identified by 'admin';
grant all privileges on * . * to 'admin'@'localhost';
ALTER USER 'admin'@'localhost' IDENTIFIED WITH mysql_native_password BY 'admin';
flush PRIVILEGES;

drop schema if exists `soen_390_db`;

create schema `soen_390_db`;

USE `soen_390_db`;

-- Table to store the users.
CREATE TABLE `soen_390_db`.`user` (
  `userID` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) NOT NULL,
  `role` VARCHAR(45) NOT NULL,
  `email` VARCHAR(45) NOT NULL,
  `password` CHAR(60) NOT NULL,
  UNIQUE INDEX `email_UNIQUE` (`email` ASC) VISIBLE,
  PRIMARY KEY (`userID`))

  collate = utf8mb4_unicode_ci;

-- Table to store the customer orders (orders of bikes).
CREATE TABLE `soen_390_db`.`customer_order` (
  `customer_order_id` INT NOT NULL AUTO_INCREMENT,
  `status` VARCHAR(45) NOT NULL,
  `date_time_added` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `date_time_finished` DATETIME,
  `price` DECIMAL(10,2) NOT NULL,
  PRIMARY KEY (`customer_order_id`))
  
  collate = utf8mb4_unicode_ci;

-- Table to store the different orders of raw materials needed for producing bikes.
CREATE TABLE `soen_390_db`.`raw_material_order` (
  `raw_material_order_id` INT NOT NULL AUTO_INCREMENT,
  `status` VARCHAR(45) NOT NULL,
  `date_time_added` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `date_time_finished` DATETIME,
  `price` DECIMAL(10,2) NOT NULL,
  PRIMARY KEY (`raw_material_order_id`))
  
  collate = utf8mb4_unicode_ci;

-- Table to store the different orders given by the manufacturing division
-- in order to create various semi-finished and finished goods.
CREATE TABLE `soen_390_db`.`production_order` (
  `production_order_id` INT NOT NULL AUTO_INCREMENT,
  `status` VARCHAR(45) NOT NULL,
  `date_time_added` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `date_time_finished` DATETIME,
  PRIMARY KEY (`production_order_id`))
  
  collate = utf8mb4_unicode_ci;

-- Table to store the raw materials, semi-finished goods, and finished goods all
-- under one table.
CREATE TABLE `soen_390_db`.`inventory_item` (
  `inventory_item_id` INT NOT NULL AUTO_INCREMENT,
  `inventory_item_name` VARCHAR(45) NOT NULL,
  `inventory_item_type` VARCHAR(45) NOT NULL,
  `quantity` INT NOT NULL DEFAULT 0,
  `date_time_added` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`inventory_item_id`),
  CONSTRAINT `validItemType`
    CHECK (`inventory_item_type` IN ("raw", "semi-finished", "finished")))
  
  collate = utf8mb4_unicode_ci;

CREATE TABLE `soen_390_db`.`inventory_item_composed_of` (
  `inventory_item_id` INT NOT NULL,
  `made_from_inventory_item_id` INT NOT NULL,
  `quantity` INT NOT NULL,
  PRIMARY KEY (`inventory_item_id`, `made_from_inventory_item_id`),
  CONSTRAINT `inventoryItemIDComposedOfForeignKey`
    FOREIGN KEY (`inventory_item_id`)
    REFERENCES `soen_390_db`.`inventory_item` (`inventory_item_id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION,
  CONSTRAINT `madeFromInventoryItemIDComposedOfForeignKey`
    FOREIGN KEY (`made_from_inventory_item_id`)
    REFERENCES `soen_390_db`.`inventory_item` (`inventory_item_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `notMadeFromSameItem`
    CHECK (`inventory_item_id` != `made_from_inventory_item_id`))
    
	collate = utf8mb4_unicode_ci;

-- Table to store the raw materials needed to build the semi-finished goods.
CREATE TABLE `soen_390_db`.`raw_material` (
  `raw_material_id` INT NOT NULL AUTO_INCREMENT,
  `inventory_item_id` INT NOT NULL,
  `price` DECIMAL(10,2) NOT NULL,
  `vendor` VARCHAR(45),
  PRIMARY KEY (`raw_material_id`),
  CONSTRAINT `rawMaterialInventoryItemIDForeignKey`
    FOREIGN KEY (`inventory_item_id`)
    REFERENCES `soen_390_db`.`inventory_item` (`inventory_item_id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION)
  
  collate = utf8mb4_unicode_ci;

-- Table to store the semi-finished goods needed to build the finished goods.
CREATE TABLE `soen_390_db`.`semi_finished_good` (
  `semi_finished_good_id` INT NOT NULL AUTO_INCREMENT,
  `inventory_item_id` INT NOT NULL,
  `price` DECIMAL(10,2) NOT NULL,
  PRIMARY KEY (`semi_finished_good_id`),
  CONSTRAINT `semiFinishedInventoryItemIDForeignKey`
    FOREIGN KEY (`inventory_item_id`)
    REFERENCES `soen_390_db`.`inventory_item` (`inventory_item_id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION)
  
  collate = utf8mb4_unicode_ci;

-- Table to store the finished goods that will be sold to the customers.
CREATE TABLE `soen_390_db`.`finished_good` (
  `finished_good_id` INT NOT NULL AUTO_INCREMENT,
  `inventory_item_id` INT NOT NULL,
  `price_of_construction` DECIMAL(10,2) NOT NULL,
  `price_of_selling` DECIMAL(10,2) NOT NULL,
  `archived` TINYINT(1) NOT NULL,
  PRIMARY KEY (`finished_good_id`),
  CONSTRAINT `finishedInventoryItemIDForeignKey`
    FOREIGN KEY (`inventory_item_id`)
    REFERENCES `soen_390_db`.`inventory_item` (`inventory_item_id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION)
  
  collate = utf8mb4_unicode_ci;

-- Table to store the various properties of the inventory items.
CREATE TABLE `soen_390_db`.`property_of_inventory_item` (
  `inventory_item_id` INT NOT NULL,
  `property_name` VARCHAR(45) NOT NULL,
  `property_value` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`inventory_item_id`, `property_name`),
  CONSTRAINT `inventoryItemIDPropertyForeignKey`
    FOREIGN KEY (`inventory_item_id`)
    REFERENCES `soen_390_db`.`inventory_item` (`inventory_item_id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION)
    
	collate = utf8mb4_unicode_ci;

-- Table to store the various raw materials that make up each raw material order.
CREATE TABLE `soen_390_db`.`ordered_raw_material` (
  `raw_material_order_id` INT NOT NULL,
  `inventory_item_id` INT NOT NULL,
  `quantity` INT NOT NULL,
  `price` DECIMAL(10,2) NOT NULL,
  `vendor` VARCHAR(45),
  PRIMARY KEY (`raw_material_order_id`, `inventory_item_id`),
  CONSTRAINT `rawMaterialOrderIDForeignKey`
    FOREIGN KEY (`raw_material_order_id`)
    REFERENCES `soen_390_db`.`raw_material_order` (`raw_material_order_id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION,
  CONSTRAINT `orderedRawInventoryItemIDForeignKey`
    FOREIGN KEY (`inventory_item_id`)
    REFERENCES `soen_390_db`.`inventory_item` (`inventory_item_id`)
    ON DELETE NO ACTION
    ON UPDATE CASCADE)
    
	collate = utf8mb4_unicode_ci;

-- Table to store the various semi-finished goods that production has given an order to
-- produce for each production order.
CREATE TABLE `soen_390_db`.`ordered_semi_finished` (
  `production_order_id` INT NOT NULL,
  `inventory_item_id` INT NOT NULL,
  `quantity` INT NOT NULL,
  PRIMARY KEY (`production_order_id`, `inventory_item_id`),
  CONSTRAINT `semiFinishedProductionOrderIDForeignKey`
    FOREIGN KEY (`production_order_id`)
    REFERENCES `soen_390_db`.`production_order` (`production_order_id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION,
  CONSTRAINT `semiFinishedGoodInventoryItemIDForeignKey`
    FOREIGN KEY (`inventory_item_id`)
    REFERENCES `soen_390_db`.`inventory_item` (`inventory_item_id`)
    ON DELETE NO ACTION
    ON UPDATE CASCADE)
    
	collate = utf8mb4_unicode_ci;

-- Table to store the various finished goods that a customer has placed an order for
-- for each customer order.
CREATE TABLE `soen_390_db`.`ordered_finished_by_customer` (
  `customer_order_id` INT NOT NULL,
  `inventory_item_id` INT NOT NULL,
  `quantity` INT NOT NULL,
  `price` DECIMAL(10,2) NOT NULL,
  PRIMARY KEY (`customer_order_id`, `inventory_item_id`),
  CONSTRAINT `finishedCustomerOrderIDForeignKey`
    FOREIGN KEY (`customer_order_id`)
    REFERENCES `soen_390_db`.`customer_order` (`customer_order_id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION,
  CONSTRAINT `finishedGoodInventoryItemIDForeignKey`
    FOREIGN KEY (`inventory_item_id`)
    REFERENCES `soen_390_db`.`inventory_item` (`inventory_item_id`)
    ON DELETE NO ACTION
    ON UPDATE CASCADE)
    
	collate = utf8mb4_unicode_ci;

-- Table to store the various finished goods that production has given an order to
-- produce for each production order.
CREATE TABLE `soen_390_db`.`ordered_finished_by_production` (
  `production_order_id` INT NOT NULL,
  `inventory_item_id` INT NOT NULL,
  `quantity` INT NOT NULL,
  PRIMARY KEY (`production_order_id`, `inventory_item_id`),
  CONSTRAINT `finishedProductionOrderIDForeignKey`
    FOREIGN KEY (`production_order_id`)
    REFERENCES `soen_390_db`.`production_order` (`production_order_id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION,
  CONSTRAINT `finishedGoodByProductionInventoryItemIDForeignKey`
    FOREIGN KEY (`inventory_item_id`)
    REFERENCES `soen_390_db`.`inventory_item` (`inventory_item_id`)
    ON DELETE NO ACTION
    ON UPDATE CASCADE)
    
	collate = utf8mb4_unicode_ci;

-- date is of the format yyyy-mm-dd and the price can be given with a maximum of two digits after the dot.

INSERT `inventory_item` (`inventory_item_name`, `inventory_item_type`, `quantity`) 
VALUES
("carbon fiber", "raw", 5),
("steel", "raw", 10),
("rubber", "raw", 7),
("leather", "raw", 5),
("titanum dioxide", "raw", 5),
("ethylene glycol", "raw", 5),
("alkyd", "raw", 7),
("paint", "semi-finished", 4),
("bike seat", "semi-finished", 2),
("carbon frame", "semi-finished", 3),
("rubber tire", "semi-finished", 4),
("steel wheel frame", "semi-finished", 4),
("steel bike handles", "semi-finished", 2),
("bike gears", "semi-finished", 3),
("steel breaks", "semi-finished", 2),
("le sebastien", "finished", 2)
;

INSERT `raw_material` (`inventory_item_id`, `price`, `vendor`) 
VALUES
(1, 5, "Maxon Factory"),
(2, 20, "Steelworks Laval"),
(3, 23, "Rubber.co"),
(4, 50.69, "Tanning Frank"),
(5, 20, "Chemical Facility Quebec"),
(6, 23, "Chemical Facility Quebec"),
(7, 50.69, "Chemical Facility Quebec")
;

INSERT `semi_finished_good` (`inventory_item_id`, `price`) 
VALUES
(8, 10.52),
(9, 20.20),
(10, 80.50),
(11, 50.37),
(12, 44.10),
(13, 24.78),
(14, 70.25),
(15, 49.36)
;

INSERT `finished_good` (`inventory_item_id`, `price_of_construction`, `price_of_selling`, `archived`) 
VALUES
(16, 682.85, 1245.99, 0)
;

INSERT `raw_material_order` (`status`, `price`) 
VALUES
("awaiting fulfillment", 4.23)
;

INSERT `customer_order` (`status`, `price`) 
VALUES
("awaiting fulfillment", 1245.99)
;

INSERT `production_order` (`status`) 
VALUES
("shipping")
;

INSERT `production_order` (`status`, `date_time_added`, `date_time_finished`) 
VALUES
("completed", '2015-05-10 13:17:17', '2015-05-30 23:21:02')
;

INSERT `inventory_item_composed_of` (`inventory_item_id`, `made_from_inventory_item_id`, `quantity`)
VALUES
(8, 5, 1),
(8, 6, 1),
(8, 7, 1),
(9, 2, 1),
(9, 4, 1),
(10, 1, 2),
(11, 3, 2),
(12, 2, 1),
(13, 2, 1),
(14, 2, 2),
(15, 2, 1),
(16, 8, 1),
(16, 9, 1),
(16, 10, 1),
(16, 11, 2),
(16, 12, 2),
(16, 13, 2),
(16, 14, 1),
(16, 15, 2)
;

INSERT `ordered_finished_by_customer` (`customer_order_id`, `inventory_item_id`, `quantity`, `price`)
VALUES
(1, 16, 1, 1245.99)
;

INSERT `ordered_finished_by_production` (`production_order_id`, `inventory_item_id`, `quantity`)
VALUES
(1, 16, 1)
;

INSERT `ordered_raw_material` (`raw_material_order_id`, `inventory_item_id`, `quantity`, `price`, `vendor`)
VALUES
(1, 1, 1, 4.23, "Metal United")
;

INSERT `ordered_semi_finished` (`production_order_id`, `inventory_item_id`, `quantity`)
VALUES
(1, 10, 1)
;

INSERT `property_of_inventory_item` (`inventory_item_id`, `property_name`, `property_value`)
VALUES
(4, "leather quality", "full-grain"),
(8, "color", "red"),
(10, "size", "18"),
(14, "number of speeds", "12"),
(16, "finish", "chrome"),
(16, "color", "red"),
(16, "number of speeds", "12")
;

-- run the line below by itself if you want to delete the adminuser from your sql db:
-- drop user if exists 'admin'@'localhost';

-- https://www.digitalocean.com/community/tutorials/how-to-create-a-new-user-and-grant-permissions-in-mysql