var express = require('express');
var router = express.Router();
var db = require('../utils/db_config');
var database = new db();

router.post('/', addProductDB,function(req, res, next) {
    res.redirect(307, '/invoice');
    // res.render('invoice', {goodsD: req.session.goodsData, clientD: req.session.client, supD: req.session.sup, cachedData: req.session.cahchedForm , generalData: req.session.general});
});

function addProductDB(req,res,next){
    var sql = `INSERT INTO Product 
    (SupplierID,ProdCode,ProdDescription)
    VALUES 
    ('${req.session.supID}','${req.body.newDiscount}','${req.body.newShipHan}');`
    
    database.query(sql).then(rows => {
        return next();
    });
    console.log(sql);
    
}
module.exports = router;