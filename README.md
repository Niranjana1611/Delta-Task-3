# Delta-Task-3

INSTALL:

npm init

npm install save express express-session path util mysql bcrypt dotenv

MYSQL:

CREATE DATABASE IF NOT EXISTS www;

USE www;

CREATE TABLE logged (id int AUTO_INCREMENT PRIMARY KEY, rollnumber int NOT NULL UNIQUE KEY, username varchar(30) NOT NULL, password varchar(200) NOT NULL);

CREATE TABLE details (rollnumber int NOT NULL, username varchar(30) NOT NULL, invitationname varchar(30) NOT NULL, invheader varchar(30) NOT NULL, invheader_font varchar(30) NOT NULL, invheader_size int NOT NULL, invbody varchar(30) NOT NULL, invbody_font varchar(30) NOT NULL, invbody_size int NOT NULL, invfooter varchar(30) NOT NULL, invfooter_font varchar(30) NOT NULL, invfooter_size int NOT NULL, rec_rollno int NOT NULL, rec_name varchar(30) NOT NULL, decision char(30)
);

Goto localhost:3333

RUN: npm start
