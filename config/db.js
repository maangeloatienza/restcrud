const mysql = require('mysql');

const connection = mysql.createConnection({
    host        : '127.0.0.1',
    user        : 'root',
    password    : '',
    database    : 'crud'
});

connection.connect((err)=>{
    if(err) throw err;
});

module.exports ={
    connection : connection
};