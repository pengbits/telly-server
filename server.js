const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const shows = require('./routes/shows');
const router = express.Router();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({'extended': true}))
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.listen(3000, function() {
  console.log('listening on 3000')
})

app.get('/',             shows.findAll);
app.get('/shows',        shows.findAll);
app.get('/shows/:id',    shows.findById);
app.post('/shows',       shows.addShow);
app.put('/shows/:id',    shows.updateShow);
app.delete('/shows/:id', shows.deleteShow);