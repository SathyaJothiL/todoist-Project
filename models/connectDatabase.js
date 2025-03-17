const mysql = require('mysql2')

const connection = mysql.createConnection({
    host:'localhost',
    user:'joe',
    password:'Apples3$',
    database:'TODOIST'
})

connection.connect(err=>{
    if(err){
        console.log("Couln't connect to the Database");
        return
    }
    console.log("Database connected"); 
})
module.exports = connection

