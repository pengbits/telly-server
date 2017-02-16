const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const shows = require('./routes/shows');
const networks = require('./routes/networks');
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

app.get('/',                shows.findAll);

app.get('/shows',           shows.findAll);
app.get('/shows/:id',       shows.findById);
app.post('/shows',          shows.add);
app.put('/shows/:id',       shows.update);
app.delete('/shows/:id',    shows.delete);

app.get('/networks',        networks.findAll)
app.get('/networks/:id',    networks.findById);
app.post('/networks',       networks.add)
app.put('/networks/:id',    networks.update);
app.delete('/networks/:id', networks.delete);