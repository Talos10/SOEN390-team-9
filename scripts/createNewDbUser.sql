-- Create a local db user in order for the backend to be able to access the data.
drop user if exists 'adminuser'@'localhost';
create user 'adminuser'@'localhost' identified by 'adminuser';
grant all privileges on * . * to 'adminuser'@'localhost';
ALTER USER 'adminuser'@'localhost' IDENTIFIED WITH mysql_native_password BY 'adminuser';
flush PRIVILEGES;

drop schema if exists `soen_390_db`;

create schema `soen_390_db`;

CREATE TABLE `soen_390_db`.`user` (
  `userID` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) NOT NULL,
  `role` VARCHAR(45) NOT NULL,
  `email` VARCHAR(45) NOT NULL,
  `password` VARCHAR(45) NOT NULL,
  UNIQUE INDEX `email_UNIQUE` (`email` ASC) VISIBLE,
  PRIMARY KEY (`userID`))

  collate = utf8mb4_unicode_ci;
  
INSERT INTO `soen_390_db`.`user` (`name`, `role`, `email`, `password`)
VALUES ('Jake', 'Admin', 'jake@email.com', 'jake');

INSERT INTO `soen_390_db`.`user` (`name`, `role`, `email`, `password`)
VALUES ('Paul', 'Employee', 'paul@email.com', 'paul');

INSERT INTO `soen_390_db`.`user` (`name`, `role`, `email`, `password`)
VALUES ('Naruto', 'Employee', 'naruto@email.com', 'naruto');

-- run the line below by itself if you want to delete the adminuser from your sql db:
-- drop user if exists 'adminuser'@'localhost';

-- https://www.digitalocean.com/community/tutorials/how-to-create-a-new-user-and-grant-permissions-in-mysql