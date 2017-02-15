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

const SHOW_ATTRS = ['name','network'];

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
  function(err, show) {
    if(err || show==null) {
      response = {
        'error' : true, 
        'message' : 'Error fetching data'
      };
    } else {
      response = {
        'error' : false, 
        'show' : show
      }
    }
    res.json(response)
  });
};

exports.addShow = (req, res) => {

  let show = {};
  let response = {};
  let keyLength = 0;
    
  SHOW_ATTRS.map(k => {
    if(req.body[k]){
      show[k] = req.body[k]
    } 
  })
  
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
        'message' : 'Data added',
        'show' : show
      };
    }
    console.log('response: '+JSON.stringify(response))
    
    res.json(response);
  })
}

exports.updateShow = (req,res) => {
  var update   = {}
  var response = {}
  var id       = req.params.id
  var query    = {
    '_id':BSON.ObjectID(id)
  }
  
  console.log('Retrieving show: ' + id);
  
  db.collection('shows').findOne(query, 
  function(err, show) {
    if(err || show==null) {
      response = {
        'error' : true, 
        'message' : 'Error fetching data'
      };
    } else {
      Object.assign(update, {
        "name"    : (req.body.name || show.name),
        "network" : (req.body.network || show.network),
      })
      
      console.log(`
        update:
          ${JSON.stringify(query)}
          ${JSON.stringify(update)}
      `)
      
      db.collection('shows').update(query, update, (err) => {
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
            'show' : Object.assign({
              '_id' : id
            }, update)
          }
        }
        
        res.json(response)
      })
    }
  });
};


exports.deleteShow = (req,res) => {
  var id = req.params.id;
  
  try {
    if(id == undefined) throw new Error('no id supplied');
    
    db.collection('shows').deleteOne({
      "_id" : BSON.ObjectID(id)
    })
    .then((result) => {
      res.json({
        'error' : false,
        'message' : `Deleted record #${id} from database`,
        'show' : {
          '_id' : id
        }
      })
    })
    
  } catch (e){
    res.json({
      'error' : true,
      'message' : `Error deleting record #${id}`,
      'show' : {}
    })
  }
  
};