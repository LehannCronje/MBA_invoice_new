var express = require('express');
var router = express.Router();
var db = require('../utils/db_config');

router.post('/', getClientSups,(req,res, next) => {
    res.render('chooseClient' , {client: req.client, sup: req.sup});
});

function getClientSups(req,res,next){
    var sql = 'select Cust_Name from Customer';
    db.query(sql, (error,results,fields) => {
        if(error){
            return console.error(error.message);
        }
        req.client = results;
        console.log(results)
    });
    var sql = 'select SupplierName from Supplier';
    db.query(sql, (error,results,fields) => {
        if(error){
            return console.error(error.message);
        }
        req.sup = results;
        return next();
    })
}

module.exports = router;