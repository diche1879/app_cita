const mysql = require('mysql');

const connection = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE
});

connection.connect(function(err) {
    if (err) throw err;
    console.log("Conectado a la base de datos");
});

module.exports = connection;