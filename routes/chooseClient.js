var express = require('express');
var router = express.Router();
var db = require('../utils/db_config');
var database = new db();

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

router.post('/', authUser,getClientSups,(req,res, next) => {
    console.log(req.client);
    res.render('chooseClient' , {client: req.client, sup: req.sup});
});

function getClientSups(req,res,next){
    
   
    //


    function reqSessionData(){
        var cachedObject = [];
        return new Promise(function(resolve, reject){
            req.session.clientSupChosen = false;
            req.session.generalData = false;
            req.session.productsChosen = false;
            cachedObject[0]={
                productCode:'EngineNo 428505',
                productDescription: 'ZFF89FPC000240386 ',
                quan: '',
                val: ''
            };
            resolve(cachedObject);
        })
           
       
   }
   let promise = reqSessionData();

   promise.then((data)=>{
        req.session.cahchedForm = data;
        var sql = 'select CustomerID,Cust_Name from Customer';
        var sql1 = 'select SupplierID,SupplierName from Supplier';
        database.query(sql).then(rows => {
            req.client = rows;
            return database.query(sql1);
        }).then(rows => {
            req.sup = rows;
            return next(); 
        }).catch( err => {
            console.error(err);
        } );;
   })
}

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
