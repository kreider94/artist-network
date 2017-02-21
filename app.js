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

app.use(express.static('artist-network'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));

app.get('/', function(req, res, next) {
    res.send('/index.html');
});

app.post('http://localhost/', function (req, res) {
  var data = req.body.data;
  console.log('post request!!');
  // postTest();
})


function listening() {
    console.log("listening...");
}

app.listen(listening);
module.exports = request;
module.exports = app;
