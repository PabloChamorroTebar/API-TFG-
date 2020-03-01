//Import modules
const mysql = require('mysql');

//Setting's connection
const mysql_connection = mysql.createConnection({
    'host': 'localhost',
    'user': 'root',
    'database': 'practica' 
});

//Create connection
mysql_connection.connect(function (err) {
    if(err){
        console.log(err);
    }
    else{
        console.log('Database is connected');
    }
});

module.exports = mysql_connection;