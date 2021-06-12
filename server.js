const express=require('express')
const bodyparser=require('body-parser');
const session=require('express-session');
const fileUpload = require('express-fileupload')
const app=express();
const http=require('http').createServer(app);
 


app.use(express.static("public")); 
app.use(bodyparser.urlencoded({extended:true}));

app.use(bodyparser.json())
app.use(fileUpload());


app.use(session({
    secret: 'ssshhhhh',
    saveUninitialized: true,
    resave: true
}))

app.use('/Admin',require('./routes/admin'));
app.use('/student',require('./routes/Student'));

app.set("view engine","ejs");

const db=require('./config/dbConnect');

db.connect((err)=>{
    if(err)
    {
        return console.error("err "+err.message);
    }
    console.log("connected to database");

    setInterval(function () {
        db.query('SELECT 1')
    }, 5000)
})

app.get('/',(req,res)=>{
    res.render('signin');
})

app.get('/signup',(req,res)=>{
    res.render('signup');
})

app.get('/resetpassword',(req,res)=>{
    res.render('resetpassword');
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
            var type=result[0].type;
            name=result[0].firstname+" "+result[0].lastname;
            if(pass==password && type=="teacher")
            res.send("SuccessloginTeacher");
            else if(pass==password && type=="student")
            res.send("SuccessloginStudent");
            else
            res.send("Incorrect Password.");
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

app.post('/resetpassword',(req,res)=>{
    var email=req.body.email;
    var password=req.body.password;

    var sendData='UPDATE members SET password=? WHERE email=?'

    db.query(sendData,[password,email],(err,result)=>{
        if(err) throw err;
    })
    res.send('Success');
})


const io=require('socket.io')(http);

io.on('connection',(socket)=>{
    console.log("Connected");

    socket.on('message',(msg)=>{

        socket.broadcast.emit('message2',msg);
    })
})




const PORT = process.env.PORT || 3000;
http.listen(PORT,()=>{
    console.log(`server running at ${PORT}`);
})

//http.listen('3000','192.168.1.7');
