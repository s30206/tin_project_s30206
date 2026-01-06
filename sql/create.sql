DROP TABLE IF EXISTS Account;

DROP TABLE IF EXISTS AccountRole;

DROP TABLE IF EXISTS "Order";

DROP TABLE IF EXISTS Person;

DROP TABLE IF EXISTS Product;

-- Created by Redgate Data Modeler (https://datamodeler.redgate-platform.com)
-- Last modification date: 2025-12-29 17:51:45.252

-- tables
-- Table: Account
CREATE TABLE Account (
                         ID integer NOT NULL CONSTRAINT Account_pk PRIMARY KEY AUTOINCREMENT,
                         Person_ID integer NOT NULL,
                         Username varchar(20) NOT NULL,
                         Password text NOT NULL,
                         AccountRole_ID integer NOT NULL,
                         CONSTRAINT Account_Person FOREIGN KEY (Person_ID)
                             REFERENCES Person (ID)
                             ON DELETE CASCADE,
                         CONSTRAINT Account_AccountRole FOREIGN KEY (AccountRole_ID)
                             REFERENCES AccountRole (ID)
);

-- Table: AccountRole
CREATE TABLE AccountRole (
                             ID integer NOT NULL CONSTRAINT AccountRole_pk PRIMARY KEY AUTOINCREMENT,
                             Name varchar(20) NOT NULL
);

-- Table: Order
CREATE TABLE "Order" (
                         ID integer NOT NULL CONSTRAINT Order_pk PRIMARY KEY AUTOINCREMENT,
                         Quantity integer NOT NULL,
                         OrderAt date NOT NULL,
                         Person_ID integer NOT NULL,
                         Product_ID integer NOT NULL,
                         CONSTRAINT Order_Person FOREIGN KEY (Person_ID)
                             REFERENCES Person (ID)
                             ON DELETE CASCADE,
                         CONSTRAINT Order_Product FOREIGN KEY (Product_ID)
                             REFERENCES Product (ID)
                             ON DELETE CASCADE
);

-- Table: Person
CREATE TABLE Person (
                        ID integer NOT NULL CONSTRAINT Person_pk PRIMARY KEY AUTOINCREMENT,
                        FirstName varchar(20) NOT NULL,
                        LastName varchar(20) NOT NULL,
                        Email varchar(40) NOT NULL,
                        Phone varchar(20) NOT NULL
);

-- Table: Product
CREATE TABLE Product (
                         ID integer NOT NULL CONSTRAINT Product_pk PRIMARY KEY AUTOINCREMENT,
                         Name varchar(20) NOT NULL,
                         Description varchar(200) NOT NULL,
                         Price real NOT NULL
);

-- End of file.