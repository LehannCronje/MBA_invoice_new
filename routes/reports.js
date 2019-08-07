var express = require('express');
var router = express.Router();
var db = require('../utils/db_config');
var database = new db();


const fakeDatabase = {
    'philip' : {job: 'professor', pet: 'cat.jpg'},
    'John' : {job: 'student', pet: 'dog.jpg'},
    'Carol' : {job: 'engineer', pet: 'bear.jpg'},
  }
  
  router.get('/reportsData', (req,res) => {
      var sql = "CALL `DB_MBA2`.`usp_MonthlyTransactionFee`('2019-07-02','2019-07-11');"
    database.query(sql).then(rows =>{
        res.send(rows);
    })
    
  });
  router.get('/reportsData2', (req,res) => {
    var sql = "CALL `DB_MBA2`.`usp_InvoiceSummary`(82481);"
    database.query(sql).then(rows =>{
      res.send(rows);
    })
  })
  router.get('/', (req,res) => {
    res.render('reports');
  })

  module.exports = router;