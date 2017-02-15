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

exports.add = (req, res) => {
  var network = {};
  var response = {};
  network.name     = req.body.name;
  network.country  = req.body.country;
  console.log('Adding Network: ' + JSON.stringify(network));
  
  db.collection('networks').save(network, {safe: true}, 
  function(err, result) {
    if(err) {
      response = {
        'error' : true, 
        'message' : 'Error adding data'
      };
    } else {
      response = {
        'error' : false, 
        'message' : 'Data added'
      };
    }
    res.json(response);
  });
};

exports.update = (req,res) => {
  var update = {};
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
      Object.assign(update, {
        "_id"     : id,
        "name"    : (req.body.name || network.name),
        "country" : (req.body.country || network.country),
      })
      db.collection('networks').save(update, (err) => {
        if(err) {
          response = {
            'error' : true, 
            'message' : 'Error fetching data'
          };
        }
        else {
          response = {
            'error' : false,
            'message' : 'Updated '+id+' successfully',
            'network' : network
          }
        }
        
        res.json(response)
      })
    }
  });
};


exports.delete = (req,res) => {
  var id = req.params.id;
  
  try {
    if(id == undefined) throw new Error('no id supplied');
    
    db.collection('networks').deleteOne({
      "_id" : BSON.ObjectID(id)
    })
    .then((result) => {
      res.json({
        'error' : false,
        'message' : `Deleted record #${id} from database`
      })
    })
    
  } catch (e){
    res.json({
      'error' : true,
      'message' : `Error deleting record #${id}`
    })
  }
}