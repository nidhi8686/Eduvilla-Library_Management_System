const express=require('express')
const bodyparser=require('body-parser');
const mysql=require('mysql')
const app=express();

app.use(bodyparser.urlencoded({extended:true}));
app.use(express.static("public")); 

app.set("view engine","ejs");

const db=mysql.createConnection({
    host :"localhost",
    user : "root",
    password:"",
    database :"library management system"
})

db.connect((err)=>{
    if(err)
    {
        return console.error("err "+err.message);
    }
    console.log("connected to database");
})
app.get('/',(req,res)=>{
    res.render('signin');
})

app.get('/signup',(req,res)=>{
    res.render('signup');
})

app.post('/signup',(req,res)=>{
    var email=req.body.email;

    console.log(email);
    res.send('done');
})

const PORT = process.env.PORT || 3000;
app.listen(PORT,()=>{
    console.log(`server running at ${PORT}`);
})