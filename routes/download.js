var express = require('express');
var router = express.Router();
var zip = require('express-zip');
var path = require('path');
var db = require('../utils/db_config');
var database = new db();


/* GET home page. */
router.post('/',addInvoiceDB,function(req, res, next) {
    res.zip([
        {path: './public/pdf/invoice1.pdf', name: 'invoice1.pdf'},
        {path: './public/pdf/invoice2.pdf', name: 'invoice2.pdf'},
        {path: './public/pdf/invoice3.pdf', name: 'invoice3.pdf'},
    ]);
    // res.render('pD');
});

function addInvoiceDB(req, res,next){
    var productIDs = [];
    var productString = '';
    
    var object = []
    object[0] = req.session.cahchedForm;
    object[1] = req.session.general;
    object[2] = productIDs;
    var sql3 = `SELECT BAI_InvoiceNumber FROM OriginalInvoiceSummary`;
    var sql4 = `select OrgInvSummaryID from originalinvoicesummary ORDER BY OrgInvSummaryID DESC LIMIT 1;`
    var sql = `insert into DB_MBA2.OriginalInvoiceSummary
    (OrgInv_InvoiceDate,OrgInv_InvoiceNumber,OrgInv_CustomerNumber,OrgInvSumm_TotCustomsValue,OrgInvSumm_DutyValue,OrgInvSumm_VAT,OrgInvSumm_Discount,OrgInvSumm_ShipHandling,OrgInvSumm_Weight)
    values 
    (${object[1].supInvDate},${object[1].supInvNum},${object[1].custAccNum},${object[1].customsVal},${object[1].totalDuty},${object[1].vat},${object[1].discount},${object[1].shipHan},${object[1].weight})
    ;`
    
    var sql1 = `insert into DB_MBA2.OriginalInvoice 
    (OrgInvSummaryID,OrgInv_ProductID,OrgInv_Price,OrgInv_Quantity,CustomerID,BA_ID,SupplierID)
    values
    ${productString}
    ;
    `
    database.query(sql3).then(rows => {
        var sql = `insert into DB_MBA2.OriginalInvoiceSummary
    (OrgInv_InvoiceDate,OrgInv_InvoiceNumber,OrgInv_CustomerNumber,OrgInvSumm_TotCustomsValue,OrgInvSumm_DutyValue,OrgInvSumm_VAT,OrgInvSumm_Discount,OrgInvSumm_ShipHandling,OrgInvSumm_Weight,OrgInvSumm_Description,BAI_InvoiceNumber )
    values 
    ('${object[1].supInvDate}','${object[1].supInvNum}','${object[1].custAccNum}','${object[1].customsVal}','${object[1].totalDuty}','${object[1].vat}','${object[1].discount}','${object[1].shipHan}','${object[1].weight}','${object[1].description}','DS${Number(rows[0].BAI_InvoiceNumber.substring(2))+1}')
    ;`
    console.log(sql);
        return database.query(sql);
    }).then(rows =>{
        var sql = `select OrgInvSummaryID from DB_MBA2.OriginalInvoiceSummary ORDER BY OrgInvSummaryID DESC LIMIT 1;`;
        return database.query(sql);
        // console.log(rows);
         
    }).then(rows => {
        // function buildQuery() {
        //     return new Promise( ( resolve, reject ) => {
                
        //         resolve(productString);
        //     } );
        // }
        // console.log(productString);
        // let promise = buildQuery();
        // promise.then((data)=>{
        //     console.log(data);
        //     return data; 
        // })
        if(Array.isArray(req.session.goodsData)){
            for(var i=0;i<req.session.goodsData.length;i++){
                var split = req.session.goodsData[i].split(',');
                productIDs[i] = split[2];
                productString += `('${rows[0].OrgInvSummaryID}','${split[2]}','${req.session.cahchedForm[i].val}','${req.session.cahchedForm[i].quan}','${req.session.clientID}','1001','${req.session.supID}'),`
            }
        }else{
            var split = req.session.goodsData.split(',');
            productIDs = split[2];
            productString += `('${rows[0].OrgInvSummaryID}','${split[2]}','${req.session.cahchedForm[0].val}','${req.session.cahchedForm[0].quan}','${req.session.clientID}','1001','${req.session.supID}')`
        }
        return productString;
    }).then(rows => {
        var sql = `insert into DB_MBA2.OriginalInvoice (OrgInvSummaryID,OrgInv_ProductID,OrgInv_Price,OrgInv_Quantity,CustomerID,BA_ID,SupplierID) values ${rows};`
        console.log(sql);
        return database.query(sql);
    }).then( rows =>{
        return next();
    }).catch( err => {
        console.error(err);
    } );
}
module.exports = router;
