var express = require('express');
var router = express.Router();
var db = require('../utils/db_config');
var database = new db();


  router.post('/reportsData', (req,res) => {
      var sql = "CALL `DB_MBA2`.`usp_MonthlyTransactionFee`('"+req.body.date1+"','"+req.body.date2+"');"
    database.query(sql).then(rows =>{
        res.send(rows);
    })
    
  });
  router.post('/reportsData2', (req,res) => {
    var sql = "CALL `DB_MBA2`.`usp_InvoiceSummary`('"+req.body.data+"');"
    database.query(sql).then(rows =>{
      res.send(rows);
    })
  })
  router.get('/', (req,res) => {
    if(req.session.username){
      res.render('reports');
  }else{
      res.redirect('/');
  }
  })

  module.exports = router;