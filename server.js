const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const shows = require('./routes/shows');
var mongo = require('mongodb');

var Server = mongo.Server,
    Db = mongo.Db,
    BSON = mongo.BSONPure;

var server = new Server('localhost', 27017, {auto_reconnect: true});
db = new Db('telly', server, {safe: true});
db.open(function(err, db) {
  if(!err) {
    console.log("Connected to 'winedb' database");
  }
})

app.use(bodyParser.urlencoded({'extended': true}))

app.listen(3000, function() {
  console.log('listening on 3000')
})

app.get('/', (req,res) => {
  res.sendFile(__dirname + '/index.html')
});

app.get('/shows', (req, res) => {
  db.collection('shows', function(err, collection) {
    collection.find().toArray(function(err, items){
      res.send(items)
    })
  });  
});

app.post('/quotes', (req, res) => {
  console.log('new quote incoming');
  console.log(req.body)
})