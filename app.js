/**
 * Created by kirstinreid on 02/02/2017.
 */

var express = require("express");

var path = require("path");
var logger = require('morgan');
var bodyParser = require('body-parser');
var neo4j = require('node-neo4j');
var app = express();

var httpUrlForTransaction = 'http://localhost:7474/db/data/transaction/commit';

db = new neo4j('http://neo4j:mackie@localhost:7474');


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
