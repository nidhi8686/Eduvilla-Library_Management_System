const express=require('express');
const instamojo=require('instamojo-nodejs');
const router=express();

router.use(express.static("public"));
const db=require('../config/dbConnect');
const { get } = require('./admin');

const API_KEY="test_a17536cc9161c7cb2f6676ca584";

const AUTH_KEY="test_e4c5857903c50b77e5f121fff3d";

instamojo.setKeys(API_KEY,AUTH_KEY);
instamojo.isSandboxMode(true);

router.get('/dashboard',(req,res)=>{
    var session=req.session.user;

    //return date
    var date = new Date();

    var day = date.getDate();
    var month = date.getMonth() + 1;
    var year = date.getFullYear();

    if (month < 10) month = "0" + month;
    if (day < 10) day = "0" + day;

    var returndate = year + "/" + month + "/" + day;
    var getData='SELECT * FROM issuedbook WHERE email=? AND status=?';

    db.query(getData,[session[0].email,"pending"],(err,result)=>{
        if(err) throw err;
        var fine=[];
        for(i=0;i<result.length;i++)
        {
            var date1=new Date(returndate);
            var date2=new Date(result[i].duedate);
            var diff=(date1.getTime()-date2.getTime())/(1000 * 3600 * 24);
            if(diff>0  && date1>date2)
            {
                fine.push(parseInt(diff)*2);
            }
            else
            {
                fine.push(0);
            }
        }
        for(j=0;j<result.length;j++)
        {
            var updatedata='UPDATE issuedbook SET fine=? , returndate=? WHERE duedate=? AND status="pending"'
            db.query(updatedata,[fine[j],returndate,result[j].duedate],(err,result1)=>{
                if(err) throw err;
            })
        }
            var getlimitedData="SELECT * FROM books LIMIT 8";
            db.query(getlimitedData,(err,result2)=>{
                if (err) throw err;

                var getbookData="SELECT * FROM (SELECT * FROM books ORDER BY s_no DESC LIMIT 7)var1 ORDER BY s_no ASC";
                db.query(getbookData,(err,result3)=>{
                    if (err) throw err;
                    var getissuedbooks="SELECT * FROM issuedbook WHERE email=? AND status=?"
                    db.query(getissuedbooks,[session[0].email,"pending"],(err,result4)=>{
                        if(err) throw err;
                        res.render('Pages/Student/Dashboard.ejs',{user:session,bookdata:result2,lastaddedbooks:result3,issuedbooks:result4});
                    })
            })
                
            })
          })  
    
})
router.post('/search',(req,res)=>{

        var value=req.body.value;
        var category=req.body.category;
        var getData="SELECT * FROM BOOKS WHERE (title LIKE '%"+value+"%') OR  (author LIKE '%"+value+"%') OR (title LIKE '%"+category+"%')"
        db.query(getData,(err,result)=>{
            if(err) throw err;
            res.send(result);
        })

})

router.get('/bookissue/:bookid',(req,res)=>{

    var bookid=req.params.bookid;
    var session=req.session.user;
    var getData="SELECT * FROM books WHERE bookid=?";
    db.query(getData,[bookid],(err,result)=>{
        if(err) throw err;
        res.render('Pages/Student/bookissue.ejs',{bookdata:result,user:session});
    })
    
})

router.get('/mybooks',(req,res)=>{
    var session=req.session.user;
    var getData='SELECT * FROM issuedbook WHERE email=? AND status=?';

    db.query(getData,[session[0].email,"pending"],(err,result)=>{
        if(err) throw err;
       res.render('Pages/Student/mybooks.ejs',{user:session,issuedbooks:result})
    })
   
})

router.post('/takebook',(req,res)=>{
    var bookid=req.body.bookid;

    //issueDate
    var date = new Date();

    var day = date.getDate();
    var month = date.getMonth() + 1;
    var year = date.getFullYear();

    if (month < 10) month = "0" + month;
    if (day < 10) day = "0" + day;

    var issuedate = year + "/" + month + "/" + day;

    //dueDate
    date.setDate(date.getDate()+7);
    var day = date.getDate();
    var month = date.getMonth() + 1;
    var year = date.getFullYear();

    if (month < 10) month = "0" + month;
    if (day < 10) day = "0" + day;

    var duedate = year + "/" + month + "/" + day;
    


    var getData="SELECT * FROM books WHERE bookid=?";
    db.query(getData,[bookid],(err,result)=>{

            var booktitle=result[0].title;
            var bookauthor=result[0].author;
            var availability=result[0].availability;
            var bookimage=result[0].ImagePath;
            var session=req.session.user;
            var firstname=session[0].firstname;
            var lastname=session[0].lastname;
            var email=session[0].email; 
            var getData='SELECT * FROM issuedbook WHERE email=? AND status=?';

            db.query(getData,[email,"pending"],(err,result1)=>{
                if(err) throw err;
                if(availability=="No")
                res.send("error");
                else if(result1.length>=4)
                res.send("max-issued")
                else
                {
                    var sendData="INSERT INTO issuedbook(bookid,title,author,availability,firstname,lastname,email,imagepath,issuedate,duedate) VALUES (?,?,?,?,?,?,?,?,?,?)"

                    db.query(sendData,[bookid,booktitle,bookauthor,availability,firstname,lastname,email,bookimage,issuedate,duedate],(err,result1)=>{
                        if(err) throw err;
                        var updateData="UPDATE books SET availability=? WHERE bookid=?"
                        db.query(updateData,["No",bookid],(err,result2)=>{
                            if(err) throw err;
                            res.send("done");
                        })
                    
                    })
                }
            })
        })
})

router.post('/issuebookdata',(req,res)=>{
   res.send("issued");
})

router.get('/summary',(req,res)=>{
    var session=req.session.user;
    var getData='SELECT * FROM issuedbook WHERE email=?';
    db.query(getData,[session[0].email],(err,result)=>{
        if(err) throw err;
        res.render('Pages/Student/summary.ejs',{user:session,issuedbooks:result})
    })
    
})

router.get('/fine',(req,res)=>{
    var session=req.session.user;

    var getData='SELECT * FROM issuedbook WHERE email=? AND fine!=0 AND status="returned"';
    db.query(getData,[session[0].email],(err,result)=>{
        if(err) throw err;
        res.render('Pages/Student/fine.ejs',{user:session,issuedbooks:result})
    })
})

router.post('/pay_now',(req,res)=>{
    var TransactionData = new instamojo.PaymentData();

    var session=req.session.user;
    const REDIRECT_URL = "http://localhost:3000/student/success";

    TransactionData.setRedirectUrl(REDIRECT_URL);
    TransactionData.send_email = "True";
    TransactionData.purpose = "Eduvilla Fine Payment";
    TransactionData.name=session[0].firstname+" "+session[0].lastname;
    TransactionData.email=session[0].email;
    TransactionData.amount=req.body.amount;
    
    instamojo.createPayment(TransactionData,(err,result)=>{
        if(err) throw err;
        res.send("done");
    })
})

router.get('/success',(req,res)=>{
    var session=req.session.user;

    var UpdateData='UPDATE issuedbook set finestatus="paid" WHERE email=? AND status="returned"';
    db.query(UpdateData,[session[0].email],(err,result)=>{
        if(err) throw err;
        var getData='SELECT * FROM issuedbook WHERE email=? AND fine!=0 AND status="returned"'
        db.query(getData,[session[0].email],(err,result1)=>{
            if(err) throw err;
            console.log(result1);
            res.render('Pages/Student/fine.ejs',{user:session,issuedbooks:result1})
        })
        
        
    })
})

router.post('/returnbook',(req,res)=>{
    var bookid=req.body.bookid;
    var UpdateData='UPDATE books SET availability="Yes" WHERE bookid=?';
    db.query(UpdateData,[bookid],(err,result)=>{
        if(err) throw err;
        var UpdateData2='UPDATE issuedbook SET status="returned" WHERE bookid=?';
        db.query(UpdateData2,[bookid],(err,result1)=>{
            if(err) throw err;
            res.send("done");
        })
    })
})

module.exports=router;