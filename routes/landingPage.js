var express = require('express');
var router = express.Router();

var mysql = require('mysql');

//database connection
var connection = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password :'',
    database: 'nodelogin'
  });
connection.connect(function(err){
    if(err){
        return console.error('error: ' + err.message);
    }
    console.log('connected to the database');
});

/* GET home page. */
router.post('/', authUser,function(req, res, next) {
    res.render('landingPage');
});

function authUser(req,res,next){
    if(!req.session.username){
        var username = req.body.username;
        var password = req.body.password;
        console.log(req.body.password);
        if(username && password){
        connection.query('SELECT * FROM users WHERE username = ? AND pass = ?', [username, password], (err,rows) => {
            if(err) throw err;
            if(rows.length > 0){
                req.session.loggedin = true;
                req.session.username = username;
                
                return next();
            }else {
                
            res.send('Incorrect Username and/or Password!');
            }
            res.end();
        });
        }else{
        
            res.send('Please enter Username and Password!');
            res.end();
        }
    }else{
        return next();
    }
    
}

module.exports = router;
