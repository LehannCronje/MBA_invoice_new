var mysql = require('mysql');

var connection = mysql.createConnection({
    host: 'localhost',
    user:'root',
    password:'',
    database: 'DB_MBA2',
});

connection.connect(function(err){
    if(err) throw err;
    console.log('connected to the database');
});

module.exports = connection;