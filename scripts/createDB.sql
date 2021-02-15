-- Create a local db user in order for the backend to be able to access the data.
drop user if exists 'admin'@'localhost';
create user 'admin'@'localhost' identified by 'admin';
grant all privileges on * . * to 'admin'@'localhost';
ALTER USER 'admin'@'localhost' IDENTIFIED WITH mysql_native_password BY 'admin';
flush PRIVILEGES;

drop schema if exists `soen_390_db`;

create schema `soen_390_db`;

USE `soen_390_db`;

CREATE TABLE `soen_390_db`.`user` (
  `userID` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) NOT NULL,
  `role` VARCHAR(45) NOT NULL,
  `email` VARCHAR(45) NOT NULL,
  `password` CHAR(60) NOT NULL,
  UNIQUE INDEX `email_UNIQUE` (`email` ASC) VISIBLE,
  PRIMARY KEY (`userID`))

  collate = utf8mb4_unicode_ci;
  
CREATE TABLE `soen_390_db`.`customer_order` (
  `customer_order_id` INT NOT NULL AUTO_INCREMENT,
  `status` VARCHAR(45) NOT NULL,
  `date_time_added` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `date_time_finished` DATETIME,
  `price` DECIMAL(10,2) NOT NULL,
  PRIMARY KEY (`customer_order_id`))
  
  collate = utf8mb4_unicode_ci;
  
CREATE TABLE `soen_390_db`.`production_order` (
  `production_order_id` INT NOT NULL AUTO_INCREMENT,
  `status` VARCHAR(45) NOT NULL,
  `date_time_added` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `date_time_finished` DATETIME,
  `price` DECIMAL(10,2) NOT NULL,
  PRIMARY KEY (`production_order_id`))
  
  collate = utf8mb4_unicode_ci;

CREATE TABLE `soen_390_db`.`raw_material` (
  `raw_material_id` INT NOT NULL AUTO_INCREMENT,
  `raw_material_name` VARCHAR(45) NOT NULL,
  `quantity` INT NOT NULL,
  `price` DECIMAL(10,2) NOT NULL,
  `vendor` VARCHAR(45),
  `date_time_added` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`raw_material_id`),
  UNIQUE INDEX `raw_material_name_UNIQUE` (`raw_material_name` ASC) VISIBLE)
  
  collate = utf8mb4_unicode_ci;
    
CREATE TABLE `soen_390_db`.`semi_finished_good` (
  `semi_finished_good_id` INT NOT NULL AUTO_INCREMENT,
  `semi_finished_good_name` VARCHAR(45) NOT NULL,
  `quantity` INT NOT NULL,
  `price` DECIMAL(10,2) NOT NULL,
  `vendor` VARCHAR(45),
  `date_time_added` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`semi_finished_good_id`),
  UNIQUE INDEX `semi_finished_good_name_UNIQUE` (`semi_finished_good_name` ASC) VISIBLE)
  
  collate = utf8mb4_unicode_ci;
    
CREATE TABLE `soen_390_db`.`finished_good` (
  `finished_good_id` INT NOT NULL AUTO_INCREMENT,
  `finished_good_name` VARCHAR(45) NOT NULL,
  `quantity` INT NOT NULL,
  `price_of_construction` DECIMAL(10,2) NOT NULL,
  `price_of_selling` DECIMAL(10,2) NOT NULL,
  `archived` TINYINT(1) NOT NULL,
  `date_time_added` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`finished_good_id`),
  UNIQUE INDEX `finished_good_name_UNIQUE` (`finished_good_name` ASC) VISIBLE)
  
  collate = utf8mb4_unicode_ci;
  
CREATE TABLE `soen_390_db`.`ordered_raw_material` (
  `production_order_id` INT NOT NULL,
  `raw_material_id` INT NOT NULL,
  `quantity` INT NOT NULL,
  `price` DECIMAL(10,2) NOT NULL,
  PRIMARY KEY (`production_order_id`, `raw_material_id`),
  CONSTRAINT `rawMaterialProductionOrderIDForeignKey`
    FOREIGN KEY (`production_order_id`)
    REFERENCES `soen_390_db`.`production_order` (`production_order_id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION,
  CONSTRAINT `rawMaterialIDForeignKey`
    FOREIGN KEY (`raw_material_id`)
    REFERENCES `soen_390_db`.`raw_material` (`raw_material_id`)
    ON DELETE NO ACTION
    ON UPDATE CASCADE)
    
	collate = utf8mb4_unicode_ci;

CREATE TABLE `soen_390_db`.`property_of_raw_material` (
  `raw_material_id` INT NOT NULL,
  `property_name` VARCHAR(45) NOT NULL,
  `property_value` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`raw_material_id`, `property_name`),
  CONSTRAINT `rawMaterialIDPropertyForeignKey`
    FOREIGN KEY (`raw_material_id`)
    REFERENCES `soen_390_db`.`raw_material` (`raw_material_id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION)
    
	collate = utf8mb4_unicode_ci;

CREATE TABLE `soen_390_db`.`property_of_semi_finished_good` (
  `semi_finished_good_id` INT NOT NULL,
  `property_name` VARCHAR(45) NOT NULL,
  `property_value` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`semi_finished_good_id`, `property_name`),
  CONSTRAINT `semiFinishedGoodPropertyIDForeignKey`
    FOREIGN KEY (`semi_finished_good_id`)
    REFERENCES `soen_390_db`.`semi_finished_good` (`semi_finished_good_id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION)
    
	collate = utf8mb4_unicode_ci;

CREATE TABLE `soen_390_db`.`property_of_finished_good` (
  `finished_good_id` INT NOT NULL,
  `property_name` VARCHAR(45) NOT NULL,
  `property_value` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`finished_good_id`, `property_name`),
  CONSTRAINT `finishedGoodPropertyIDForeignKey`
    FOREIGN KEY (`finished_good_id`)
    REFERENCES `soen_390_db`.`finished_good` (`finished_good_id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION)
    
	collate = utf8mb4_unicode_ci;
    
CREATE TABLE `soen_390_db`.`ordered_semi_finished` (
  `production_order_id` INT NOT NULL,
  `semi_finished_good_id` INT NOT NULL,
  `quantity` INT NOT NULL,
  `price` DECIMAL(10,2) NOT NULL,
  PRIMARY KEY (`production_order_id`, `semi_finished_good_id`),
  CONSTRAINT `semiFinishedProductionOrderIDForeignKey`
    FOREIGN KEY (`production_order_id`)
    REFERENCES `soen_390_db`.`production_order` (`production_order_id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION,
  CONSTRAINT `semiFinishedGoodIDForeignKey`
    FOREIGN KEY (`semi_finished_good_id`)
    REFERENCES `soen_390_db`.`semi_finished_good` (`semi_finished_good_id`)
    ON DELETE NO ACTION
    ON UPDATE CASCADE)
    
	collate = utf8mb4_unicode_ci;

CREATE TABLE `soen_390_db`.`ordered_finished_by_customer` (
  `customer_order_id` INT NOT NULL,
  `finished_good_id` INT NOT NULL,
  `quantity` INT NOT NULL,
  `price` DECIMAL(10,2) NOT NULL,
  PRIMARY KEY (`customer_order_id`, `finished_good_id`),
  CONSTRAINT `finishedCustomerOrderIDForeignKey`
    FOREIGN KEY (`customer_order_id`)
    REFERENCES `soen_390_db`.`customer_order` (`customer_order_id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION,
  CONSTRAINT `finishedGoodIDForeignKey`
    FOREIGN KEY (`finished_good_id`)
    REFERENCES `soen_390_db`.`finished_good` (`finished_good_id`)
    ON DELETE NO ACTION
    ON UPDATE CASCADE)
    
	collate = utf8mb4_unicode_ci;
    
CREATE TABLE `soen_390_db`.`ordered_finished_by_production` (
  `production_order_id` INT NOT NULL,
  `finished_good_id` INT NOT NULL,
  `quantity` INT NOT NULL,
  `price` DECIMAL(10,2) NOT NULL,
  PRIMARY KEY (`production_order_id`, `finished_good_id`),
  CONSTRAINT `finishedProductionOrderIDForeignKey`
    FOREIGN KEY (`production_order_id`)
    REFERENCES `soen_390_db`.`production_order` (`production_order_id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION,
  CONSTRAINT `finishedGoodByProductionIDForeignKey`
    FOREIGN KEY (`finished_good_id`)
    REFERENCES `soen_390_db`.`finished_good` (`finished_good_id`)
    ON DELETE NO ACTION
    ON UPDATE CASCADE)
    
	collate = utf8mb4_unicode_ci;
    
CREATE TABLE `soen_390_db`.`semi_finished_composed_of` (
  `semi_finished_good_id` INT NOT NULL,
  `raw_material_id` INT NOT NULL,
  `quantity` INT NOT NULL,
  PRIMARY KEY (`semi_finished_good_id`, `raw_material_id`),
  CONSTRAINT `semiFinishedGoodIDComposedOfForeignKey`
    FOREIGN KEY (`semi_finished_good_id`)
    REFERENCES `soen_390_db`.`semi_finished_good` (`semi_finished_good_id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION,
  CONSTRAINT `rawMaterialIDComposedOfForeignKey`
    FOREIGN KEY (`raw_material_id`)
    REFERENCES `soen_390_db`.`raw_material` (`raw_material_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
    
	collate = utf8mb4_unicode_ci;
    
CREATE TABLE `soen_390_db`.`finished_composed_of` (
  `finished_good_id` INT NOT NULL,
  `semi_finished_good_id` INT NOT NULL,
  `quantity` INT NOT NULL,
  PRIMARY KEY (`finished_good_id`, `semi_finished_good_id`),
  CONSTRAINT `finishedGoodIDComposedOfForeignKey`
    FOREIGN KEY (`finished_good_id`)
    REFERENCES `soen_390_db`.`finished_good` (`finished_good_id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION,
  CONSTRAINT `semiFinishedGoodIDComposedOf2ForeignKey`
    FOREIGN KEY (`semi_finished_good_id`)
    REFERENCES `soen_390_db`.`semi_finished_good` (`semi_finished_good_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
    
	collate = utf8mb4_unicode_ci;
    
-- date is of the format yyyy-mm-dd and the price can be given with a maximum of two digits after the dot
INSERT `raw_material` (`raw_material_id`, `raw_material_name`, `quantity`, `price`, `vendor`) 
VALUES
(null, "carbon fiber", 5, 5, "Maxon Factory"),
(null, "steel", 10, 20, "Steelworks Laval"),
(null, "rubber", 7, 23, "Rubber.co"),
(null, "leather", 5, 50.69, "Tanning Frank")
;

INSERT `semi_finished_good` (`semi_finished_good_id`, `semi_finished_good_name`, `quantity`, `price`, `vendor`) 
VALUES
(null, "blue paint", 4, 10.52, "Value Paint"),
(null, "bike seat", 2, 20.20, null),
(null, "carbon frame", 3, 80.50, null),
(null, "rubber tire", 4, 50.37, null),
(null, "steel wheel frame", 4, 44.10, null),
(null, "steel bike handles", 2, 24.78, null),
(null, "bike gears", 3, 70.25, null),
(null, "steel breaks", 2, 49.36, null)
;

INSERT `finished_good` (`finished_good_id`, `finished_good_name`, `quantity`, `price_of_construction`, `price_of_selling`, `archived`) 
VALUES
(null, "le sebastien", '1', 682.85, 1245.99, 0)
;

INSERT `customer_order` (`customer_order_id`, `status`, `price`) 
VALUES
(null, "awaiting fulfillment", 1245.99)
;

INSERT `production_order` (`production_order_id`, `status`, `price`) 
VALUES
(null, "completed", 4.23),
(null, "completed", 14.01)
;

INSERT `semi_finished_composed_of` 
VALUES
(2, 2, 1),
(2, 4, 1),
(3, 1, 4),
(4, 3, 2),
(5, 4, 1),
(6, 2, 1),
(7, 4, 1),
(8, 2, 1)
;

INSERT `finished_composed_of` 
VALUES
(1, 1, 1),
(1, 2, 1),
(1, 3, 1),
(1, 4, 4),
(1, 5, 4),
(1, 6, 2),
(1, 7, 1),
(1, 8, 2)
;

INSERT `ordered_finished_by_customer` 
VALUES
(1, 1, 1, 1245.99)
;

INSERT `ordered_finished_by_production` 
VALUES
(1, 1, 1, 1245.99)
;

INSERT `ordered_raw_material` 
VALUES
(1, 1, 1, 4.23)
;

INSERT `ordered_semi_finished` 
VALUES
(2, 1, 1, 14.01)
;

INSERT `property_of_raw_material` 
VALUES
(4, "leather quality", "full-grain")
;

INSERT `property_of_semi_finished_good` 
VALUES
(3, "size", "18"),
(3, "finish", "chrome"),
(7, "number of speeds", "12")
;

INSERT `property_of_finished_good` 
VALUES
(1, "color", "blue"),
(1, "size", "medium")
;

-- run the line below by itself if you want to delete the adminuser from your sql db:
-- drop user if exists 'admin'@'localhost';

-- https://www.digitalocean.com/community/tutorials/how-to-create-a-new-user-and-grant-permissions-in-mysql