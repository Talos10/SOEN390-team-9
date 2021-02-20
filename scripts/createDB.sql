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
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) NOT NULL,
  `type` VARCHAR(45) NOT NULL,
  `processTime` INT NOT NULL,
  `quantity` INT NOT NULL DEFAULT 0,
  `uploadDate` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `archived` TINYINT(1) NOT NULL DEFAULT 0,
  `cost` DECIMAL(10,2) NOT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `validItemType`
    CHECK (`type` IN ("raw", "semi-finished", "finished")))
  
  collate = utf8mb4_unicode_ci;

-- Table to store the raw goods (materials) needed to build the semi-finished goods.
CREATE TABLE `soen_390_db`.`raw_good` (
  `id` INT NOT NULL,
  `vendor` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `rawMaterialInventoryItemIDForeignKey`
    FOREIGN KEY (`id`)
    REFERENCES `soen_390_db`.`inventory_good` (`id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION)
  
  collate = utf8mb4_unicode_ci;

-- Table to store the semi-finished goods needed to build the finished goods.
CREATE TABLE `soen_390_db`.`semi-finished_good` (
  `id` INT NOT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `semiFinishedInventoryItemIDForeignKey`
    FOREIGN KEY (`id`)
    REFERENCES `soen_390_db`.`inventory_good` (`id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION)
  
  collate = utf8mb4_unicode_ci;

-- Table to store the finished goods that will be sold to the customers.
CREATE TABLE `soen_390_db`.`finished_good` (
  `id` INT NOT NULL,
  `price` DECIMAL(10,2) NOT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `finishedInventoryItemIDForeignKey`
    FOREIGN KEY (`id`)
    REFERENCES `soen_390_db`.`inventory_good` (`id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION)
  
  collate = utf8mb4_unicode_ci;

-- Table to store the various properties of the inventory items.
CREATE TABLE `soen_390_db`.`property_of_good` (
  `compositeId` INT NOT NULL,
  `name` VARCHAR(45) NOT NULL,
  `value` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`compositeId`, `name`),
  CONSTRAINT `inventoryItemIDPropertyForeignKey`
    FOREIGN KEY (`compositeId`)
    REFERENCES `soen_390_db`.`inventory_good` (`id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION)
    
	collate = utf8mb4_unicode_ci;

CREATE TABLE `soen_390_db`.`composition_of_good` (
  `compositeId` INT NOT NULL,
  `componentId` INT NOT NULL,
  `quantity` INT NOT NULL,
  PRIMARY KEY (`compositeId`, `componentId`),
  CONSTRAINT `inventoryItemIDComposedOfForeignKey`
    FOREIGN KEY (`compositeId`)
    REFERENCES `soen_390_db`.`inventory_good` (`id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION,
  CONSTRAINT `madeFromInventoryItemIDComposedOfForeignKey`
    FOREIGN KEY (`componentId`)
    REFERENCES `soen_390_db`.`inventory_good` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `notMadeFromSameItem`
    CHECK (`compositeId` != `componentId`))
    
	collate = utf8mb4_unicode_ci;

-- Table to store the different orders given by the manufacturing division
-- in order to buy raw goods and to create semi-finished and finished goods.
CREATE TABLE `soen_390_db`.`manufacturing_order` (
  `orderId` INT NOT NULL AUTO_INCREMENT,
  `status` VARCHAR(45) NOT NULL,
  `totalCost` DECIMAL(10,2) DEFAULT 0,
  `startDate` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `endDate` DATETIME,
  PRIMARY KEY (`orderId`))
  
  collate = utf8mb4_unicode_ci;

-- Table to store the bought raw goods and to store the various semi-finished goods that
-- the manufacturing division has given an order to produce for each manufacturing order.
CREATE TABLE `soen_390_db`.`ordered_good` (
  `orderId` INT NOT NULL,
  `compositeId` INT NOT NULL,
  `totalItemCost` DECIMAL(10,2) DEFAULT 0,
  `quantity` INT NOT NULL,
  PRIMARY KEY (`orderId`, `compositeId`),
  CONSTRAINT `manufacturingOrderIDForeignKey`
    FOREIGN KEY (`orderId`)
    REFERENCES `soen_390_db`.`manufacturing_order` (`orderId`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION,
  CONSTRAINT `orderedGoodInventoryItemIDForeignKey`
    FOREIGN KEY (`compositeId`)
    REFERENCES `soen_390_db`.`inventory_good` (`id`)
    ON DELETE NO ACTION
    ON UPDATE CASCADE)
    
	collate = utf8mb4_unicode_ci;

-- date is of the format yyyy-mm-dd and the price can be given with a maximum of two digits after the dot.

INSERT `inventory_good` (`name`, `type`, `quantity`, `processTime`, `cost`) 
VALUES
("carbon fiber", "raw", 5, 1440, 5),
("steel", "raw", 10, 1440, 10.5),
("rubber", "raw", 7, 1440, 15.5),
("leather", "raw", 5, 720, 20.5),
("titanum dioxide", "raw", 5, 800, 30.5),
("ethylene glycol", "raw", 5, 30, 40.5),
("alkyd", "raw", 7, 5, 50.5),
("paint", "semi-finished", 4, 10, 55.5),
("bike seat", "semi-finished", 2, 60, 32.23),
("carbon frame", "semi-finished", 3, 24, 34.43),
("rubber tire", "semi-finished", 4, 365, 24.23),
("steel wheel frame", "semi-finished", 4, 10, 25.25),
("steel bike handles", "semi-finished", 2, 40, 26.25),
("bike gears", "semi-finished", 3, 400, 24.52),
("steel breaks", "semi-finished", 2, 100, 251.21),
("le sebastien", "finished", 2, 2000, 21.24)
;

INSERT `raw_good` (`id`, `vendor`) 
VALUES
(1, "Maxon Factory"),
(2, "Steelworks Laval"),
(3, "Rubber.co"),
(4, "Tanning Frank"),
(5, "Chemical Facility Quebec"),
(6, "Chemical Facility Quebec"),
(7, "Chemical Facility Quebec")
;

INSERT `semi-finished_good` (`id`) 
VALUES
(8),
(9),
(10),
(11),
(12),
(13),
(14),
(15)
;

INSERT `finished_good` (`id`, `price`) 
VALUES
(16, 1245.99)
;

INSERT `manufacturing_order` (`status`) 
VALUES
("shipping"),
("cancelled")
;

INSERT `manufacturing_order` (`status`, `startDate`, `endDate`) 
VALUES
("completed", '2015-05-10 13:17:17', '2015-05-30 23:21:02')
;

INSERT `composition_of_good` (`compositeId`, `componentId`, `quantity`)
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

INSERT `ordered_good` (`orderId`, `compositeId`, `quantity`)
VALUES
(1, 16, 1),
(2, 1, 1),
(2, 2, 1),
(2, 3, 1),
(3, 11, 1)
;

INSERT `property_of_good` (`compositeId`, `name`, `value`)
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