DROP DATABASE IF EXISTS superpizza;
CREATE DATABASE IF NOT EXISTS superpizza;

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
  phone CHAR(14),
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

CREATE TABLE IF NOT EXISTS TimeSlot (
  hour CHAR(5),
  used SMALLINT(1),
  PRIMARY KEY (hour));


INSERT INTO Pizzas (idPizza, name, description, price, img) 
VALUES(0, 'Amora', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.', 9.00, 'amora'),
(1, 'Angry Pizz', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.', 10.00, 'angry'),
(2, 'La Malédiction de Cthulhu', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.', 15.00, 'cthulhu'),
(3, 'Dragon Fire', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.', 12.00, 'dragon'),
(4, 'Hello Pizzy', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.', 12.00, 'kitty'),
(5, 'Pacman', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.', 12.00, 'pacman'),
(6, 'Smily Pizz', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.', 10.00, 'smile'),
(7, 'Umbrella', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.', 15.00, 'umbrella');

INSERT INTO TimeSlot (hour, used)
VALUES('18:10',0),('18:20',0),('18:30',0),('18:40',0),('18:50',0),
('19:00',0),('19:10',0),('19:20',0),('19:30',0),('19:40',0),('19:50',0),
('20:00',0),('20:10',0),('20:20',0),('20:30',0),('20:40',0),('20:50',0),
('21:00',0),('21:10',0),('21:20',0),('21:30',0),('21:40',0),('21:50',0),
('22:00',0),('22:10',0),('22:20',0),('22:30',0),('22:40',0),('22:50',0),('23:00',0);

delimiter |

CREATE EVENT reset_orders_timeslot
ON SCHEDULE EVERY 1 DAY
STARTS CURRENT_DATE() + INTERVAL 1 DAY
DO
  BEGIN
    DELETE FROM OrderPizza;
    DELETE FROM Orders;
    UPDATE Orders SET state = 0;
    UPDATE TimeSlot SET used = 0;
  END |

delimiter ;
