var express = require('express');
var router = express.Router();
var db = require('../utils/db_config');

var clientCodes = [
    ['Africa',1001],
];

router.post('/', getProducts,renderInvoice);

function getProducts(req,res,next){
    var sql = 'SELECT * FROM product WHERE SupplierID=?'
    req.client = req.body.client;
    req.sup = req.body.sup;
    for(var i=0; i<clientCodes.length;i++){
        if(clientCodes[i][0]== req.body.sup){
            db.query(sql, [clientCodes[i][1]], (error,results,fields) => {
                if(error){
                    return console.error(error.message);
                }
                req.goodsData = results;
                return next();
            })
        }
    }
};

function renderInvoice(req,res){
    res.render('invoice', {goodsD: req.goodsData, clientD: req.client, supD: req.sup});
}

module.exports = router;