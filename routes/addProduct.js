var express = require('express');
var router = express.Router();

router.post('/', function(req, res, next) {
    console.log(req.body)
    res.render('invoice', {goodsD: req.session.goodsData, clientD: req.session.client, supD: req.session.sup, cachedData: req.session.cahchedForm , generalData: req.session.general});
});

module.exports = router;