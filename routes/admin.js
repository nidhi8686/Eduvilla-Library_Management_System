const express=require('express');
const router=express();

router.use(express.static("public"));

const db = require('../config/dbConnect');

//@type    GET
//$route   /Dashboard/additems
//@desc    add book
//@access  PRIVATE
router.get('/additems',(req,res)=>{
    // if(req.session.user)
    // {

        var getData='SELECT * FROM books';
        db.query(getData,(err,result)=>{
            if (err) throw err;
            res.render('../views/Pages/Admin/Additems.ejs',{ bookdata : result });
            
        })
        
    //}
    
})

//@type    GET
//$route   /Dashboard/logout
//@desc    logout
//@access  PRIVATE
router.get('/logout',(req,res)=>{
    // if(req.session.user)
    // {
       delete req.session.user;
       console.log("Admin logout");
       res.redirect('/');
    //}
})

router.post('/bookform',(req,res)=>{
    var bookid=req.body.bookid;
    var title=req.body.title;
    var author=req.body.author;
    var publisher=req.body.publisher;
    var price=req.body.price;
    var availability=req.body.availability;
    var file = req.files.bookpic;
    if(file.mimetype=='image/jpeg' || file.mimetype=='image/png' || file.mimetype=='image/gif')
    {
        var imagename=file.name;
        var imgsrc="images/"+imagename;

        var sendData='INSERT INTO books(bookid,title,author,publisher,price,availability,ImagePath) VALUES(?,?,?,?,?,?,?)';
        db.query(sendData,[bookid,title,author,publisher,price,availability,imgsrc],(err,result)=>{
            if (err) throw err;
            file.mv('public/images/' + file.name);
           console.log("Data successfully save");
           res.send("Item Added!!");
        })
    }
    else
    {
        res.send("Please Upload image");
    }
})


module.exports = router;

