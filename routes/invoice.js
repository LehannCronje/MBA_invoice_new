var express = require('express');
var router = express.Router();
var db = require('../utils/db_config');
const session = require('express-session');


var clientCodes = [
    ['SCUDERIA SOUTH AFRICA (PTY) LTD',1001],
];

router.post('/', getProducts,renderInvoice);

function getProducts(req,res,next){
    var sql = 'SELECT * FROM Product WHERE SupplierID=1001';
    req.client = req.body.client;
    req.sup = req.body.sup;
    req.session.sup = req.body.sup;
    req.session.client = req.body.client;
    db.query(sql, (error,results,fields) => {
        if(error){
            return console.error(error.message);
        }
        req.goodsData = results;
        req.session.goodsData = results;
        return next();
    })
    // for(var i=0; i<clientCodes.length;i++){
    //     if(clientCodes[i][0]== req.body.sup){
    //         db.query(sql, [clientCodes[i][1]], (error,results,fields) => {
    //             if(error){
    //                 return console.error(error.message);
    //             }
    //             req.goodsData = results;
    //             req.session.goodsData = results;
    //             return next();
    //         })
    //     }
    // }
};

function renderInvoice(req,res){
    res.render('invoice', {goodsD: req.goodsData, clientD: req.session.client, supD: req.session.sup});
}

module.exports = router;