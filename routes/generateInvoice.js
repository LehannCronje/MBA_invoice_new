var express = require('express');
var router = express.Router();
var invoice = require('../utils/generate_Invoices');
var db = require('../utils/db_config');
var database = new db();
var fs = require('fs');
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
    res.render('pD');
});

function genInvoices(req,res,next){

    var object = {};
    var general = {};
    var new_goods = [];
     function genDataForInvoices(){
         return new Promise(function(resolve, reject){
             //cache data
            req.session.clientSupChosen = true;
            req.session.productsChosen = true;
            var cachedObject = [];

            if(Array.isArray(req.body.goodsD)){
                for(var i=0;i<(req.body.goodsD).length;i++){
                    var goods = (req.body.goodsD)[i];
                    var split = goods.split(",");
                    cachedObject.push({
                        productCode:split[0],
                        productDescription: split[1],
                        quan: (req.body.quan)[i],
                        val: (req.body.data)[i],
                    });
                }
                req.session.cahchedForm = cachedObject;
            }else{
                var goods = (req.body.goodsD);
                    var split = goods.split(",");
                    cachedObject.push({
                        productCode:split[0],
                        productDescription: split[1],
                        quan: (req.body.quan)[0],
                        val: (req.body.data)[0],
                    });
            }

            //invoice data
            object[0] = req.client[0];
            object[1] = req.sup[0];
            object[2] = req.body.goodsD;
            object[3] = req.ba[0];
            object[4] = req.body.quan;
            req.session.goodsData = req.body.goodsD;
            general = {
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
            req.session.general = general;
            
            req.session.generalData = true;
            
            if(Array.isArray(object[2])){
                for(var i=0;i<object[2].length;i++){
                    var split = object[2][i].split(',');
                    new_goods.push([split[0],split[1],object[4][i],req.body.data[i]]);
                }
                resolve(new_goods);
            }else{
                var split = object[2].split(',');
                new_goods.push([split[0],split[1],object[4],req.body.data]);
                resolve(new_goods);
            }
         })
            
        
    }
    let promise = genDataForInvoices();
    promise.then( (data)=>{
        invoice.createDocx(data,object['1'],object['0'],object['3'],general,() =>{
            // return next();
            invoice.createPDF(12,(data)=>{
                setTimeout(function(){ return next(); }, 5000);
                
            })
        })
    }
    );
    // promise.then(()=>{
        
    //     return next()
    // })

    
    
}

function getSupClientBa(req,res,next){
  
    
    var sql = `select * from Customer where Cust_Name='${req.body.client}'`;
    var sql1 = `select * from Supplier where SupplierName='${req.body.sup}'`;
    var sql2 = 'select * from BuyingAgent where BA_ID=1001';

    database.query(sql).then(rows => {
        req.client = rows;
        return database.query(sql1);
    }).then(rows => {
        req.sup = rows;
        return database.query(sql2);
    }).then(rows => {
        req.ba = rows;
        return next();
    }).catch( err => {
        console.error(err);
    } );
}
function mergeInvoices(req,res,next){
    const files = [
        `./public/pdf/invoice1.pdf`,
        `./public/pdf/invoice2.pdf`,
        `./public/pdf/invoice3.pdf`
    ];
    PDFMerge(files, {output: `./public/pdf/merge.pdf`})
    .then((buffer) => {return next()}).catch((e)=>{
        console.log(e);
    });
}
module.exports = router;