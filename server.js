const express=require('express')
const bodyparser=require('body-parser');
const mysql=require('mysql')
const session=require('express-session');
const app=express();

app.use(bodyparser.urlencoded({extended:true}));
app.use(express.static("public")); 
app.use(bodyparser.json())

app.use(session({
    secret: 'ssshhhhh',
    saveUninitialized: true,
    resave: true
}))
app.use('/Dashboard',require('./routes/admin'));

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

app.get('/Dashboard',(req,res)=>{
    // if(req.session.user)
    // {
        res.render('Dashboard');
    //}
   
})

app.post('/',(req,res)=>{
    var email=req.body.email;
    var password=req.body.password;
    var getData='SELECT * FROM members WHERE email=?'

    db.query(getData,[email],(err,result)=>{
        if(err) throw err;
        
        if(result[0]!=null)
        {
           req.session.user=result;
            var pass=result[0].password;
            if(pass==password)
            res.send("Successlogin");
            else
            res.send("Incorrect Password .");
        }
        else{
            res.send("Your account doesn't exist.");
        }
    })
})


app.post('/signup',(req,res)=>{
    var fname=req.body.fname;
    var lname=req.body.lname;
    var address=req.body.address;
    var select=req.body.select;
    var date=req.body.date;
    var email=req.body.email;
    var password=req.body.password;

    var sendData='INSERT INTO members(firstname,lastname,address,type,regisdate,email,password) VALUES (?,?,?,?,?,?,?)'

    db.query(sendData,[fname,lname,address,select,date,email,password],(err,result)=>{
        if(err) throw err;
    })
     res.send('Success');
})


// const PORT = process.env.PORT || 3000;
// app.listen(PORT,()=>{
//     console.log(`server running at ${PORT}`);
// })

app.listen('3000','192.168.1.6');
