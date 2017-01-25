var mongo = require('mongodb');

var Server = mongo.Server,
    Db = mongo.Db,
    BSON = mongo.BSONPure;

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

exports.addShow = (req, res) => {

  var show = req.body;
  console.log('Adding Show: ' + JSON.stringify(show));
  
  db.collection('shows').save(show, {safe: true}, function(err, result) {
    if (err) return console.log('An error has occurred');

    console.log('Success: ' + JSON.stringify(result[0]));
    res.redirect('/')
  });
};