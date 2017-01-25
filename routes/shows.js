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
    res.render('index.ejs', {shows: results})
  })
};

exports.findById = (req,res) => {
  var id = req.params.id;
  console.log('Retrieving show: ' + id);
  db.collection('shows').findOne({'_id':BSON.ObjectID(id)}, function(err, item) {
    res.render('show.ejs', {show: item})
  });
};

exports.editShow = (req,res) => {
  var id = req.params.id;
  console.log('Retrieving show: ' + id);
  db.collection('shows').findOne({'_id':BSON.ObjectID(id)}, function(err, item) {
    res.render('edit.ejs', {show: item})
  });
};

exports.addShow = (req, res) => {

  var show = req.body;
  console.log('Adding Show: ' + JSON.stringify(show));
  
  db.collection('shows').save(show, {safe: true}, function(err, result) {
    if (err) return console.log('An error has occurred');

    console.log('Success: ' + JSON.stringify(result[0]));
    res.redirect('/')
  });
};