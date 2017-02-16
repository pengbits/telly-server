var mongo = require('mongodb');
var BSON =  require('bson');
var {Connection} = require('./connection');
var db = new Connection().db; 

exports.findAll = (req,res) => {
  // db.collection('shows').find().toArray((err,results) => {
  //   res.json({shows: results})
  // })
  db.collection('shows').aggregate([{
    $lookup: {
      from:'networks', 
      localField:'networkId', 
      foreignField: '_id', 
      as:'network'}
    }
  ]).toArray((err,results) => {
    res.json({shows: results})
  })

};

exports.findById = (req,res) => {
  var id = req.params.id;
  var response = {};
  console.log('Retrieving show: ' + id);
  
  db.collection('shows').aggregate([{
    $lookup: {
      from:'networks',
      localField:'networkId',
      foreignField:'_id',
      as:'network'
    }
  },{
    $match:{
      _id: BSON.ObjectId("58a5d386a8c54c2dbb5a9037")
    }
  }],
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

exports.add = (req, res) => {
  var show = {};
  var response = {};
  show.name         = req.body.name;
  show.networkId    = req.body.networkId;
  show.networkName  = req.body.networkName;
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
  var update = {};
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
      Object.assign(update, {
        "_id"         : id,
        "name"        : (req.body.name || show.name),
        "networkId"   : (req.body.networkId || show.networkId)
      })
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
            'show' : show
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
        'message' : `Deleted record #${id} from database`
      })
    })
    
  } catch (e){
    res.json({
      'error' : true,
      'message' : `Error deleting record #${id}`
    })
  }
  
};