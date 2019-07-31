var express = require('express');
var router = express.Router();

router.post('/', addProductDB,function(req, res, next) {
    console.log(req.body);
    res.render('invoice', {goodsD: req.session.goodsData, clientD: req.session.client, supD: req.session.sup, cachedData: req.session.cahchedForm , generalData: req.session.general});
});

function addProductDB(req,res,next){
    return next();
}
module.exports = router;