const path = require("path");
require('dotenv').config({ path: path.join(__dirname, '.env') });

const mysql = require('mysql2');

// Environment variables
const PORT = process.env.PORT;
const host = process.env.DB_HOST;
const password = process.env.DB_PASSWORD;
const database = process.env.DB_DATABASE;
const user = process.env.DB_USER;

// console.log(user, host, password, database);

// Create a MySQL connection pool
const pool = mysql.createPool({
  host: host,
  user: user,
  password: password,
  database: database,
  connectionLimit: 500,
});

// Export the pool for use in other files
module.exports = pool;
