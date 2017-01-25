const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const shows = require('./routes/shows');
const router = express.Router();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({'extended': true}))

router.get('/', function (req,res){
  res.json({'error':false, 'mesage':'hi there'})
})
app.use('/', router);

app.listen(3000, function() {
  console.log('listening on 3000')
})

// app.get('/',          shows.findAll);
// app.get('/shows',     shows.findAll);
// app.get('/shows/:id', shows.findById);
// app.get('/shows/(:id)/edit', shows.editShow);
// app.post('/shows',    shows.addShow);