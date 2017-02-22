var mongo = require('mongodb');
var BSON =  require('bson');
var {Connection} = require('./connection');
var db = new Connection().db; 

const show_attrs = {
  'name':null,
  'network':null,
  'status':null
}

const getAttrs = (source={}, defaults={}) => {
  let key,val; 
  let attrs = {};
  for(key in show_attrs){
    attrs[key] = source[key] || defaults[key]
  }
  return attrs
}

const feedback = {
  'GET' :    {
    'success' : `Retreived show successfully`,
    'error' : `There was no record with that id.`
  },
  'CREATE' : {
    'success' : `Created a new Show`,
    'error' : `There was an error, your Show could not be saved.`
  },
  'UPDATE' : {
    'success' : `Saved changes to Show`,
    'error' : `There was an error, and your updates could not be saved.`
  },
  'DELETE' : {
    'success' : `Deleted show successfully`,
    'error' : `There was an error, and your Show could not be deleted.`
  }
}

const getMessage = (method,success) => {
  const entry  = feedback[method];
  return success ? entry.success : entry.error
}

const getResponse = (method,success) => {
  return {
    'error'   : !success,
    'message' : getMessage(method, success)
  }
} 

const handleResponse = (responder, method, store, meta) => {
  return (error, result) => {
    let response = getResponse(method, !error)
    if(!error && store){
      response[store] = Object.assign({}, result, (meta || {}))
    }
    console.log(JSON.stringify(response))
    responder.json(response)
  }
}

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
    handleResponse(res, 'GET', 'show')
  )
};



exports.add = (req, res) => {
  var response = {};
  var show     = getAttrs(req.body);
  console.log('Adding Show: ' + JSON.stringify(show));
  
  db.collection('shows').save(show, {safe: true}, 
    handleResponse(res, 'CREATE')
  );
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
      response = getResponse('UPDATE', false)
    } 
    else 
    {
      update        = getAttrs(req.body, show);
      update['_id'] = BSON.ObjectID(id);

      db.collection('shows').save(update, (err) => {
        response = getResponse('UPDATE', !err)
        if(!err)   response.show = update;

        console.log(JSON.stringify(response))
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