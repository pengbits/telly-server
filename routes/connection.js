var mongo = require('mongodb');
var Server = mongo.Server;
var Db = mongo.Db;
var BSON = require('bson');
let instance = null;

class Connection {
  constructor(){
    console.log('hello from Connection')
    if(!instance){
      instance = this;
    }
    
    this.connect();
    return this;
  }
  
  connect(){
    this.server = new Server('localhost', 27017, {auto_reconnect: true});
    this.db =     new Db('telly', this.server,   {safe: true});
    this.db.open(function(err, db) {
      if(!err) {
        console.log("Connected to 'showdb' database");
      }
    })
    return this.db
  }
}


exports.Connection = Connection;