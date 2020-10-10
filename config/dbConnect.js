const mysql=require('mysql')

const connect=mysql.createConnection({
    host :"localhost",
    user : "root",
    password:"",
    database :"library management system"
})

module.exports=connect;