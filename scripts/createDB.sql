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
  `resetPasswordToken` VARCHAR(60),
  `resetPasswordExpires` BIGINT,
  UNIQUE INDEX `email_UNIQUE` (`email` ASC) VISIBLE,
  PRIMARY KEY (`userID`))

  collate = utf8mb4_unicode_ci;

-- Table to store the raw materials, semi-finished goods, and finished goods all
-- under one table.
CREATE TABLE `soen_390_db`.`inventory_good` (
  `inventory_good_id` INT NOT NULL AUTO_INCREMENT,
  `inventory_good_name` VARCHAR(45) NOT NULL,
  `inventory_good_type` VARCHAR(45) NOT NULL,
  `quantity` INT NOT NULL DEFAULT 0,
  `date_time_added` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`inventory_good_id`),
  CONSTRAINT `validItemType`
    CHECK (`inventory_good_type` IN ("raw", "semi-finished", "finished")))
  
  collate = utf8mb4_unicode_ci;

-- Table to store the raw goods (materials) needed to build the semi-finished goods.
CREATE TABLE `soen_390_db`.`raw_good` (
  `inventory_good_id` INT NOT NULL,
  `buying_cost` DECIMAL(10,2) NOT NULL,
  `vendor` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`inventory_good_id`),
  CONSTRAINT `rawMaterialInventoryItemIDForeignKey`
    FOREIGN KEY (`inventory_good_id`)
    REFERENCES `soen_390_db`.`inventory_good` (`inventory_good_id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION)
  
  collate = utf8mb4_unicode_ci;

-- Table to store the semi-finished goods needed to build the finished goods.
CREATE TABLE `soen_390_db`.`semi_finished_good` (
  `inventory_good_id` INT NOT NULL,
  `manufacturing_cost` DECIMAL(10,2) NOT NULL,
  PRIMARY KEY (`inventory_good_id`),
  CONSTRAINT `semiFinishedInventoryItemIDForeignKey`
    FOREIGN KEY (`inventory_good_id`)
    REFERENCES `soen_390_db`.`inventory_good` (`inventory_good_id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION)
  
  collate = utf8mb4_unicode_ci;

-- Table to store the finished goods that will be sold to the customers.
CREATE TABLE `soen_390_db`.`finished_good` (
  `inventory_good_id` INT NOT NULL,
  `manufacturing_cost` DECIMAL(10,2) NOT NULL,
  `selling_price` DECIMAL(10,2) NOT NULL,
  `archived` TINYINT(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (`inventory_good_id`),
  CONSTRAINT `finishedInventoryItemIDForeignKey`
    FOREIGN KEY (`inventory_good_id`)
    REFERENCES `soen_390_db`.`inventory_good` (`inventory_good_id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION)
  
  collate = utf8mb4_unicode_ci;

-- Table to store the various properties of the inventory items.
CREATE TABLE `soen_390_db`.`property_of_good` (
  `inventory_good_id` INT NOT NULL,
  `property_name` VARCHAR(45) NOT NULL,
  `property_value` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`inventory_good_id`, `property_name`),
  CONSTRAINT `inventoryItemIDPropertyForeignKey`
    FOREIGN KEY (`inventory_good_id`)
    REFERENCES `soen_390_db`.`inventory_good` (`inventory_good_id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION)
    
	collate = utf8mb4_unicode_ci;

CREATE TABLE `soen_390_db`.`composition_of_good` (
  `inventory_good_id` INT NOT NULL,
  `made_from_inventory_good_id` INT NOT NULL,
  `quantity` INT NOT NULL,
  PRIMARY KEY (`inventory_good_id`, `made_from_inventory_good_id`),
  CONSTRAINT `inventoryItemIDComposedOfForeignKey`
    FOREIGN KEY (`inventory_good_id`)
    REFERENCES `soen_390_db`.`inventory_good` (`inventory_good_id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION,
  CONSTRAINT `madeFromInventoryItemIDComposedOfForeignKey`
    FOREIGN KEY (`made_from_inventory_good_id`)
    REFERENCES `soen_390_db`.`inventory_good` (`inventory_good_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `notMadeFromSameItem`
    CHECK (`inventory_good_id` != `made_from_inventory_good_id`))
    
	collate = utf8mb4_unicode_ci;

-- Table to store the different orders given by the manufacturing division
-- in order to buy raw goods and to create semi-finished and finished goods.
CREATE TABLE `soen_390_db`.`manufacturing_order` (
  `manufacturing_order_id` INT NOT NULL AUTO_INCREMENT,
  `status` VARCHAR(45) NOT NULL,
  `total_cost` DECIMAL(10,2) DEFAULT 0,
  `date_time_added` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `date_time_finished` DATETIME,
  PRIMARY KEY (`manufacturing_order_id`))
  
  collate = utf8mb4_unicode_ci;

-- Table to store the bought raw goods and to store the various semi-finished goods that
-- the manufacturing division has given an order to produce for each manufacturing order.
CREATE TABLE `soen_390_db`.`ordered_good` (
  `manufacturing_order_id` INT NOT NULL,
  `inventory_good_id` INT NOT NULL,
  `total_item_cost` DECIMAL(10,2) DEFAULT 0,
  `quantity` INT NOT NULL,
  PRIMARY KEY (`manufacturing_order_id`, `inventory_good_id`),
  CONSTRAINT `manufacturingOrderIDForeignKey`
    FOREIGN KEY (`manufacturing_order_id`)
    REFERENCES `soen_390_db`.`manufacturing_order` (`manufacturing_order_id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION,
  CONSTRAINT `orderedGoodInventoryItemIDForeignKey`
    FOREIGN KEY (`inventory_good_id`)
    REFERENCES `soen_390_db`.`inventory_good` (`inventory_good_id`)
    ON DELETE NO ACTION
    ON UPDATE CASCADE)
    
	collate = utf8mb4_unicode_ci;

-- Triggers:

DELIMITER $$

-- Update the cost of the manufacturing order after adding an additional item to the order.
CREATE TRIGGER before_ordered_good_insert
BEFORE INSERT
ON `ordered_good` FOR EACH ROW
BEGIN
    DECLARE itemCostTotal DECIMAL(10,2);
    DECLARE goodType VARCHAR(45);
    
    SELECT `Inv`.inventory_good_type
	FROM `soen_390_db`.`inventory_good` as `Inv`
	WHERE `Inv`.inventory_good_id = NEW.inventory_good_id
	INTO goodType;
    
    IF goodType = "raw" THEN
		SELECT `Raw`.buying_cost * NEW.quantity
		FROM `soen_390_db`.`raw_good` as `Raw`
		WHERE NEW.inventory_good_id = `Raw`.inventory_good_id
		INTO itemCostTotal;
    ELSEIF goodType = "semi-finished" THEN
		SELECT `Semi`.manufacturing_cost * NEW.quantity
		FROM `soen_390_db`.`semi_finished_good` as `Semi`
		WHERE NEW.inventory_good_id = `Semi`.inventory_good_id
		INTO itemCostTotal;
	ELSE
		SELECT `Finished`.manufacturing_cost * NEW.quantity
		FROM `soen_390_db`.`finished_good` as `Finished`
		WHERE NEW.inventory_good_id = `Finished`.inventory_good_id
		INTO itemCostTotal;
	END IF;
    
    SET NEW.total_item_cost = itemCostTotal;
    
    UPDATE `soen_390_db`.`manufacturing_order`
		SET
			`total_cost` = `total_cost` + itemCostTotal
		WHERE `manufacturing_order_id` = NEW.manufacturing_order_id;
END $$

DELIMITER ;

DELIMITER $$

-- Update the cost of the manufacturing order after modifying an existing item of the order.
CREATE TRIGGER before_ordered_good_update
BEFORE UPDATE
ON `ordered_good` FOR EACH ROW
BEGIN
    DECLARE previousItemCostTotal DECIMAL(10,2);
    DECLARE itemCost DECIMAL(10,2);
    DECLARE goodType VARCHAR(45);
    
    SELECT `Inv`.inventory_good_type
	FROM `soen_390_db`.`inventory_good` as `Inv`
	WHERE `Inv`.inventory_good_id = NEW.inventory_good_id
	INTO goodType;
    
    IF goodType = "raw" THEN
		SELECT `Raw`.buying_cost
		FROM `soen_390_db`.`raw_good` as `Raw`
		WHERE NEW.inventory_good_id = `Raw`.inventory_good_id
		INTO itemCost;
    ELSEIF goodType = "semi-finished" THEN
		SELECT `Semi`.manufacturing_cost
		FROM `soen_390_db`.`semi_finished_good` as `Semi`
		WHERE NEW.inventory_good_id = `Semi`.inventory_good_id
		INTO itemCost;
	ELSE
		SELECT `Finished`.manufacturing_cost
		FROM `soen_390_db`.`finished_good` as `Finished`
		WHERE NEW.inventory_good_id = `Finished`.inventory_good_id
		INTO itemCost;
	END IF;
    
    SET NEW.total_item_cost = itemCost * NEW.quantity;
    SET previousItemCostTotal = itemCost * OLD.quantity;

    UPDATE `soen_390_db`.`manufacturing_order`
		SET
			`total_cost` = `total_cost` - previousItemCostTotal + NEW.total_item_cost
		WHERE `manufacturing_order_id` = NEW.manufacturing_order_id;	
END $$

DELIMITER ;

DELIMITER $$

-- Update the cost of the manufacturing order after deleting an existing item of the order.
CREATE TRIGGER after_ordered_good_delete
AFTER DELETE
ON `ordered_good` FOR EACH ROW
BEGIN
    UPDATE `soen_390_db`.`manufacturing_order`
		SET
			`total_cost` = `total_cost` - OLD.total_item_cost
		WHERE `manufacturing_order_id` = OLD.manufacturing_order_id;	
END $$

DELIMITER ;

-- date is of the format yyyy-mm-dd and the price can be given with a maximum of two digits after the dot.

INSERT `inventory_good` (`inventory_good_name`, `inventory_good_type`, `quantity`) 
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

INSERT `raw_good` (`inventory_good_id`, `buying_cost`, `vendor`) 
VALUES
(1, 5, "Maxon Factory"),
(2, 20, "Steelworks Laval"),
(3, 23, "Rubber.co"),
(4, 50.69, "Tanning Frank"),
(5, 20, "Chemical Facility Quebec"),
(6, 23, "Chemical Facility Quebec"),
(7, 50.69, "Chemical Facility Quebec")
;

INSERT `semi_finished_good` (`inventory_good_id`, `manufacturing_cost`) 
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

INSERT `finished_good` (`inventory_good_id`, `manufacturing_cost`, `selling_price`, `archived`) 
VALUES
(16, 682.85, 1245.99, 0)
;

INSERT `manufacturing_order` (`status`) 
VALUES
("shipping"),
("cancelled")
;

INSERT `manufacturing_order` (`status`, `date_time_added`, `date_time_finished`) 
VALUES
("completed", '2015-05-10 13:17:17', '2015-05-30 23:21:02')
;

INSERT `composition_of_good` (`inventory_good_id`, `made_from_inventory_good_id`, `quantity`)
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

INSERT `ordered_good` (`manufacturing_order_id`, `inventory_good_id`, `quantity`)
VALUES
(1, 16, 1),
(2, 1, 1),
(2, 2, 1),
(2, 3, 1),
(3, 11, 1)
;

INSERT `property_of_good` (`inventory_good_id`, `property_name`, `property_value`)
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