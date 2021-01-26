var mysql = require('mysql');
const path = require('path')
require("dotenv").config({ path: path.resolve(__dirname, '../../../env/database.env') });

//creating a connection to local db and then testing it
var connection = mysql.createConnection({
    host: process.env.MYSQL_HOSTNAME,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
});

//open the MySQL connection
connection.connect((error: any) => {
    if (error) throw error;
    console.log("Successfully connected to the database.");
});

connection.end();

//method used to create a db connection
exports.createNewConnection = () => {
    return mysql.createConnection({
        host: process.env.MYSQL_HOSTNAME,
        user: process.env.MYSQL_USER,
        password: process.env.MYSQL_PASSWORD,
        database: process.env.MYSQL_DATABASE
    });
}