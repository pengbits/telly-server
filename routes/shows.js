var mongo = require('mongodb');
var Server = mongo.Server;
var Db = mongo.Db;
var BSON = require('bson');

var server = new Server('localhost', 27017, {auto_reconnect: true});
db = new Db('telly', server, {safe: true});

db.open(function(err, db) {
  if(!err) {
    console.log("Connected to 'showdb' database");
  }
})

exports.findAll = (req,res) => {
  db.collection('shows').find().toArray((err,results) => {
    res.json({shows: results})
  })
};

exports.findById = (req,res) => {
  var id = req.params.id;
  var response = {};
  console.log('Retrieving show: ' + id);
  
  db.collection('shows').findOne({
    '_id':BSON.ObjectID(id)
  }, 
  function(err, item) {
    if(err || item==null) {
      response = {
        'error' : true, 
        'message' : 'Error fetching data'
      };
    } else {
      response = {
        'error' : false, 
        'show' : item
      }
    }
    res.json(response)
  });
};

exports.addShow = (req, res) => {

  var show = {};
  var response = {};
  show.name     = req.body.name;
  show.network  = req.body.network;
  console.log('Adding Show: ' + JSON.stringify(show));
  
  db.collection('shows').save(show, {safe: true}, 
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