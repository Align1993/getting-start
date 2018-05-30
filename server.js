var express = require('express')
var fs = require('fs')
var path = require('path')
var cp = require('child_process')
var app = express()

app.use('/', express.static(__dirname + '/static'))
app.listen(3000)