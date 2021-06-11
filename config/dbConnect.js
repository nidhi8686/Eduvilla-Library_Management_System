const mysql=require('mysql')

const connect=mysql.createConnection({
    host     : "remotemysql.com",
    user     : "8evbGsFC8U",
    password : "wIqv9IMwWn",
    database : "8evbGsFC8U"
})

module.exports=connect;