var express = require('express')
var path = require('path')
var app = express()

app.use(express.static(path.join(__dirname, 'release')));
app.listen(8090)

app.get('/', function(req, res) {
  res.end('hahahah')
})