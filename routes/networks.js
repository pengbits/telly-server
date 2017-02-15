var mongo = require('mongodb');
var BSON =  require('bson');
var {Connection} = require('./connection');
var db = new Connection().db; 

exports.findAll = (req,res) => {
  db.collection('networks').find().toArray((err,results) => {
    res.json({networks: results})
  })
};
