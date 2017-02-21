var mongo = require('mongodb');
var BSON =  require('bson');
var {Connection} = require('./connection');
var db = new Connection().db; 

exports.findAll = (req,res) => {
  db.collection('networks').find().toArray((err,results) => {
    res.json({networks: results})
  })
};

exports.findById = (req,res) => {
  var id = req.params.id;
  var response = {};
  console.log('Retrieving network: ' + id);
  
  db.collection('networks').findOne({
    '_id':BSON.ObjectID(id)
  }, 
  function(err, network) {
    if(err || network==null) {
      response = {
        'error' : true, 
        'message' : 'Error fetching data'
      };
    } else {
      response = {
        'error' : false, 
        'network' : network
      }
    }
    res.json(response)
  });
};
