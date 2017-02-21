var mongo = require('mongodb');
var BSON =  require('bson');
var {Connection} = require('./connection');
var db = new Connection().db; 

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
    console.log(show)
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

const SHOW_ATTRS = {
  'name':null,
  'network':null,
  'status':null
}

getAttrs = (source={}, defaults={}) => {
  let key,val; 
  let attrs = {};
  for(key in SHOW_ATTRS){
    attrs[key] = source[key] || defaults[key]
  }
  return attrs
}


exports.add = (req, res) => {
  var response = {};
  var show     = getAttrs(req.body);
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

exports.update = (req,res) => {
  var response = {};
  var update   = {};
  var id       = req.params.id;
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
      
      update        = getAttrs(req.body, show);
      update['_id'] = BSON.ObjectID(id);

      db.collection('shows').save(update, (err) => {
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
            'show' : update
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
    
    db.collection('shows').deleteOne({
      "_id" : BSON.ObjectID(id)
    })
    .then((result) => {
      console.log('promise resolved')   
      res.json({
        'error' : false,
        'message' : `Deleted record #${id} from database`,
        'show': {
          '_id' : id
        }
      })
    })
    
  } catch (e){
    res.json({
      'error' : true,
      'message' : `Error deleting record #${id}`
    })
  }
  
};