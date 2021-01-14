DROP DATABASE superpizza;
CREATE DATABASE IF NOT EXISTS superpizza;

CREATE USER IF NOT EXISTS admin@localhost IDENTIFIED BY 'admin';

GRANT ALL ON superpizza.* TO admin@localhost;
FLUSH privileges;

use superpizza;

CREATE TABLE IF NOT EXISTS Pizzas (
  idPizza SMALLINT NOT NULL, 
  name VARCHAR(50),
  description VARCHAR(200),
  price DECIMAL(4,2),
  img VARCHAR(20),
  PRIMARY KEY (idPizza));

CREATE TABLE IF NOT EXISTS Orders (
  idOrder INTEGER NOT NULL auto_increment,
  lastName VARCHAR(30),
  firstName VARCHAR(30),
  phone VARCHAR(15),
  state SMALLINT(1),
  price DECIMAL(5,2),
  timeSlot VARCHAR(5),
  PRIMARY KEY (idOrder));

CREATE TABLE IF NOT EXISTS OrderPizza (
  idOrder INTEGER NOT NULL,
  idPizza SMALLINT NOT NULL,
  qty SMALLINT NOT NULL,
  FOREIGN KEY (idOrder) REFERENCES Orders(idOrder),
  FOREIGN KEY (idPizza) REFERENCES Pizzas(idPizza),
  CONSTRAINT PK_comPizza PRIMARY KEY (idOrder,idPizza));


INSERT INTO Pizzas (idPizza, name, description, price, img) 
VALUES(0, 'Amora', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.', 9.00, 'amora'),
(1, 'Angry Pizz', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.', 10.00, 'angry'),
(2, 'La Malédiction de Cthulhu', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.', 15.00, 'cthulhu'),
(3, 'Dragon Fire', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.', 12.00, 'dragon'),
(4, 'Hello Pizzy', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.', 12.00, 'kitty'),
(5, 'Pacman', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.', 12.00, 'pacman'),
(6, 'Smily Pizz', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.', 10.00, 'smile'),
(7, 'Umbrella', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.', 15.00, 'umbrella');

