var express = require('express');
var router = express.Router();
var invoice = require('../utils/generate_Invoices');
var db = require('../utils/db_config');

var supCodes = [
    ['Africa',1001],
];

var clientCodes = [
    ['Scuderia',1001],
];

/* GET home page. */
router.post('/',getSupClient,genInvoices, (req,res)=>{
    
    res.render('invoice', {goodsD: req.goodsData, clientD: req.client, supD: req.sup});
});

function genInvoices(req,res,next){
    var object = {}
    object[0] = req.client[0];
    object[1] = req.sup[0];
    object[2] = req.body.goodsD;

    var new_goods = [];
    if(Array.isArray(object[2])){
        for(var i=0;i<object[2].length;i++){
            var split = object[2][i].split(',');
            new_goods.push([split[0],split[1],req.body.data[i]]);
        }
    }else{
        var split = object[2].split(',');
            new_goods.push([split[0],split[1],req.body.data]);
    }
    invoice.createDocx(new_goods,object[1],object[0],() =>{
        invoice.createPDF(12,(data)=>{
            return next();
        })
    });
}

function getSupClient(req,res,next){
    var sql = 'select * from customer';
    for(var i=0;i<clientCodes.length;i++){
        if(req.body.client == clientCodes[i][0]){
            db.query(sql, (error,results,fields) => {
                if(error){
                    return console.error(error.message);
                }
                req.client = results;
                
            })
        }
    }
    var sql = 'select * from supplier'
    for(var i=0;i<supCodes.length;i++){
        if(req.body.sup == supCodes[i][0]){
            db.query(sql, (error,results,fields) => {
                if(error){
                    return console.error(error.message);
                }
                req.sup = results;
                return next();
            })
        }
    }
    
}

module.exports = router;