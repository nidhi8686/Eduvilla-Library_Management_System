const express=require('express');
const router=express();

router.use(express.static("public"));

//@type    GET
//$route   /Dashboard/additems
//@desc    add book
//@access  PRIVATE
router.get('/additems',(req,res)=>{
    // if(req.session.user)
    // {
        res.render('Additems');
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
    console.log(req.body);
    // var bookid=req.body.bookid;
    // var title=req.body.title;
    // console.log(bookid+" "+title);
})


module.exports = router;

