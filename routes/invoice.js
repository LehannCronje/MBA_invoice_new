var express = require('express');
var router = express.Router();
var db = require('../utils/db_config');
var database = new db();
const session = require('express-session');


var clientCodes = [
    ['SCUDERIA SOUTH AFRICA (PTY) LTD',1001],
];

router.post('/', getProducts,renderInvoice);

function getProducts(req,res,next){

    
    if(!req.session.clientSupChosen){
        req.client = req.body.client;
        req.sup = req.body.sup;
        clientSplit = req.client.split(',');
        supSplit = req.sup.split(',');
        req.session.supID = supSplit[0];
        req.session.clientID = clientSplit[0];
        req.session.sup = supSplit[1];
        req.session.client = clientSplit[1];
        var sql = `SELECT * FROM Product WHERE SupplierID=${req.session.supID}`;
    }else{
        var sql = `SELECT * FROM Product WHERE SupplierID=${req.session.supID}`;
    }
    if(!req.session.generalData){
        req.session.general = {
            supInvNum: '',
            supInvDate: '',
            custAccNum: '',
            customsVal: '',
            totalDuty: '',
            vat: '',
            discount: '',
            shipHan: '',
            weight:'',
            description: ''
        }
    }
    console.log(req.session.clientSupChosen);
    database.query(sql).then(rows => {
        req.goodsData = rows;
        req.session.goodsData = rows;
    }).then(()=>{
        return next();
    })
};

function renderInvoice(req,res){
    res.render('invoice', {goodsD: req.goodsData, clientD: req.session.client, supD: req.session.sup, cachedData: req.session.cahchedForm , generalData: req.session.general});
}

module.exports = router;

//SCUDERIA SOUTH AFRICA (PTY) LTD
//Aquila Africa Limited