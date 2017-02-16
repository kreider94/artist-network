/**
 * Created by kirstinreid on 02/02/2017.
 */

var express = require("express");

var path = require("path");
var logger = require('morgan');
var bodyParser = require('body-parser');
var request = require('request');
var neo4j = require('node-neo4j');
var app = express();


var httpUrlForTransaction = 'http://localhost:7474/db/data/transaction/commit';

app.use(express.static('artist-network'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.get('/', function (req, res,next) {
  res.send('/index.html');
});

function listening(){
    console.log("listening...");
}

app.listen(listening);
module.exports = app;
