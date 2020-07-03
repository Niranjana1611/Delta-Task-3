const util = require('util');
const mysql = require('mysql');
require('dotenv').config();

const pool = mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    user: process.env.USER, 
    password: process.env.PASSWORD, 
    database: 'www'
});

pool.getConnection((err, connection) => {
    if(err) 
        console.error(err.message);
    
    if(connection)
        connection.release();
    
    return;
});

pool.query = util.promisify(pool.query);

module.exports = pool;