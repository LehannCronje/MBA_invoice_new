var express = require('express');
var router = express.Router();
var invoice = require('../utils/generate_Invoices');
var db = require('../utils/db_config');
const session = require('express-session');

const PDFMerge = require('pdf-merge');

var supCodes = [
    ['Africa',1001],
];

var clientCodes = [
    ['Scuderia',1001],
];

/* GET home page. */
router.post('/',getSupClientBa,genInvoices,mergeInvoices, (req,res)=>{
    var cachedObject = [];
    for(var i=0;i<(req.body.goodsD).length;i++){
        var goods = (req.body.goodsD)[i];
        var split = goods.split(",");
        cachedObject.push({
            productCode:split[0],
            productDescription: split[1],
            quan: (req.body.quan)[i],
            val: (req.body.data)[i]
        });
    }
    req.session.cahchedForm = cachedObject;
    console.log(cachedObject);
    res.render('pD');
});

function genInvoices(req,res,next){
    var object = {}
    object[0] = req.client[0];
    object[1] = req.sup[0];
    object[2] = req.body.goodsD;
    object[3] = req.ba[0];
    object[4] = req.body.quan;
    req.session.goodsData = req.body.goodsD;
    var general = {
        supInvNum: req.body.supInvNum,
        supInvDate: req.body.supInvDate,
        custAccNum: req.body.custAccNum,
        customsVal: req.body.customsVal,
        totalDuty: req.body.totalDuty,
        vat: req.body.vat,
        discount: req.body.discount,
        shipHan: req.body.shipHan,
        weight: req.body.weight,
        description: req.body.description
    }
    var new_goods = [];
    if(Array.isArray(object[2])){
        for(var i=0;i<object[2].length;i++){
            var split = object[2][i].split(',');
            new_goods.push([split[0],split[1],object[4][i],req.body.data[i]]);
        }
    }else{
        var split = object[2].split(',');
            new_goods.push([split[0],split[1],object[4],req.body.data]);
    }
    invoice.createDocx(new_goods,object[1],object[0],object[3],general,() =>{
        invoice.createPDF(12,(data)=>{
            return next();
        })
    });
}

function getSupClientBa(req,res,next){
    var sql = 'select * from Customer where Cust_Name=?';
    db.query(sql,req.body.client ,(error,results,fields) => {
        if(error){
            return console.error(error.message);
        }
        req.client = results;
        
    })
    // for(var i=0;i<clientCodes.length;i++){
    //     if(req.body.client == clientCodes[i][0]){
            
    //     }
    // }
    var sql = 'select * from Supplier where SupplierName=?'
    db.query(sql, req.body.sup,(error,results,fields) => {
        if(error){
            return console.error(error.message);
        }
        req.sup = results;
    })
    // for(var i=0;i<supCodes.length;i++){
    //     if(req.body.sup == supCodes[i][0]){
    //     }
    // }
    var sql = 'select * from BuyingAgent where BA_ID=1001'
    db.query(sql, (error,results,fields) => {
        if(error){
            return console.error(error.message);
        }
        req.ba = results;
        return next();
    })
    // for(var i=0;i<supCodes.length;i++){
    //     if(req.body.sup == supCodes[i][0]){
    //     }
    // }
    
}
function mergeInvoices(req,res,next){
    // const files = [
    //     `./public/pdf/invoice1.pdf`,
    //     `./public/pdf/invoice2.pdf`,
    //     `./public/pdf/invoice3.pdf`
    // ];
    // PDFMerge(files, {output: `./public/pdf/merge.pdf`})
    // .then((buffer) => {return next()});
    return next();
}
module.exports = router;