# Delta-Task-3

INSTALL:

npm init

npm install save express express-session path util mysql bcrypt dotenv

MYSQL:

CREATE DATABASE IF NOT EXISTS www;

USE www;

CREATE TABLE logged (id int AUTO_INCREMENT PRIMARY KEY, rollnumber int NOT NULL UNIQUE KEY, username varchar(30) NOT NULL, mailid varchar(70) NOT NULL, password varchar(200) NOT NULL);

Goto localhost:3333

RUN: npm start
