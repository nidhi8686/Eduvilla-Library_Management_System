const express = require('express');
const router = express();

router.use(express.static("public"));

const db = require('../config/dbConnect');



router.get('/Dashboard', (req, res) => {
    if (req.session.user) {
        var session = req.session.user;
        var studentCount = 'SELECT COUNT(id) AS students FROM members WHERE type="student"'
        db.query(studentCount, (err, resultstudent) => {
            if (err) throw err;
            var bookCount = 'SELECT COUNT(s_no) AS books FROM books'
            db.query(bookCount, (err, resultbook) => {
                if (err) throw err;
                var bookavailCount = 'SELECT COUNT(s_no) AS bookavail FROM books WHERE availability="yes"'
                db.query(bookavailCount, (err, resulavailtbook) => {
                    if (err) throw err;
                    var getData = 'SELECT * FROM issuedbook WHERE status="pending" LIMIT 5'
                    db.query(getData, (err, result) => {
                        if (err) throw err;
                        res.render('./Pages/Admin/Dashboard.ejs', {
                            user: session,
                            students: resultstudent,
                            books: resultbook,
                            bookavail: resulavailtbook,
                            studentdata: result
                        });
                    })

                })

            })

        })

    }

})

//@type    GET
//$route   /Dashboard/additems
//@desc    add book
//@access  PRIVATE
router.get('/additems', (req, res) => {
    if (req.session.user) {

        var session = req.session.user;
        var getData = "SELECT * FROM (SELECT * FROM books ORDER BY s_no DESC LIMIT 5)var1 ORDER BY s_no ASC";
        db.query(getData, ["s_no"], (err, result) => {
            if (err) throw err;
            res.render('../views/Pages/Admin/Additems.ejs', {
                bookdata: result,
                user: session
            });

        })

    }

})

router.get('/issueditems', (req, res) => {
    if (req.session.user) {
        var session = req.session.user;
        var getData = "SELECT * FROM issuedbook WHERE status='pending'"
        db.query(getData, (err, result) => {
            if (err) throw err;
            var membersdata = 'SELECT * FROM members WHERE type="student"'
            db.query(membersdata, (err, resultmembers) => {
                if (err) throw err;
                res.render('Pages/Admin/issueditems', {
                    user: session,
                    issuedbooks: result,
                    members: resultmembers
                });
            })

        })
    }

})

//@type    GET
//$route   /Dashboard/logout
//@desc    logout
//@access  PRIVATE
router.get('/logout', (req, res) => {
    if (req.session.user) {
        delete req.session.user;
        console.log("Admin logout");
        res.redirect('/');
    }
})

router.get('/stocks', (req, res) => {

    if (req.session.user) {
        var session = req.session.user;
        var getData = 'SELECT * FROM books WHERE availability="Yes"'
        db.query(getData, (err, result) => {
            if (err) throw err;
            var getData2 = 'SELECT * FROM books WHERE availability="No"'
            db.query(getData2, (err, result2) => {
                if (err) throw err;
                res.render('Pages/Admin/stocks', {
                    user: session,
                    booksavail: result,
                    booksnotavail: result2
                })
            })

        })
    }

})

router.post('/bookform', (req, res) => {
    if (req.session.user) {
        var bookid = req.body.bookid;
        var title = req.body.title;
        var author = req.body.author;
        var publisher = req.body.publisher;
        var price = req.body.price;
        var category = req.body.category;
        var availability = req.body.availability;
        var file = req.files.bookpic;
        if (file.mimetype == 'image/jpeg' || file.mimetype == 'image/png' || file.mimetype == 'image/gif') {
            var imagename = file.name;
            var imgsrc = "images/" + imagename;
            var sendData = 'INSERT INTO books(bookid,title,author,publisher,price,availability,category,ImagePath) VALUES(?,?,?,?,?,?,?,?)';
            db.query(sendData, [bookid, title, author, publisher, price, availability, category, imgsrc], (err, result) => {
                if (err) throw err;
                file.mv('public/images/' + file.name);
                console.log("Data successfully save");
                res.send("success");
            })
        } else {
            res.send("error");
        }
    }
})


module.exports = router;