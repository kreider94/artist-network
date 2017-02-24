/**
 * Created by kirstinreid on 02/02/2017.
 */

var express = require("express");

var path = require("path");
var logger = require('morgan');
var bodyParser = require('body-parser');
var request = require('request');
var Neo4j = require('simple-neo4j');
var http = require('http');
var app = express();
var url = "http://neo4j:plexis@www.neo4j.com";
var httpUrlForTransaction = 'http://localhost:7474/db/data/transaction/commit';
var usersList = [];
/**
app.use('/static', express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));

http.createServer(app).listen(app.get('port'),
  function(){
    console.log("Express server listening on port " + app.get('port'));
});

app.get('/', function(req, res, next) {
    res.sendFile(path.join(__dirname, '../public', '/index.html'));
});

app.set('port', process.env.PORT);


app.listen(app.get('port'));

module.exports = request;
module.exports = app;
**/

"use strict";
var express = require('express')
var serveStatic = require('serve-static')

app.get('/', function (req, res) {
  res.render('index', {});
});

var staticBasePath = './';

var app = express()

app.use(serveStatic(staticBasePath, {'index': false}))
app.listen(8080);
