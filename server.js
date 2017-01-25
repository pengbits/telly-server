const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const shows = require('./routes/shows');

app.use(bodyParser.urlencoded({'extended': true}))
app.set('view engine', 'ejs');

app.listen(3000, function() {
  console.log('listening on 3000')
})

app.get('/',        shows.findAll);
app.post('/shows',  shows.addShow);