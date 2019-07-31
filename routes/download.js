var express = require('express');
var router = express.Router();
var zip = require('express-zip');
var path = require('path');

/* GET home page. */
router.post('/',addInvoiceDB,function(req, res, next) {
    res.zip([
        {path: './public/pdf/invoice1.pdf', name: 'invoice1.pdf'},
        {path: './public/pdf/invoice2.pdf', name: 'invoice2.pdf'},
        {path: './public/pdf/invoice3.pdf', name: 'invoice3.pdf'},
    ]);
    
});

function addInvoiceDB(req, res){
    var object = []
    object[0] = req.session.cahchedForm;
    object[1] = req.session.general
    return next();
}
module.exports = router;
