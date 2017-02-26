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
var nodemon = require('nodemon');
var app = express();
var url = "http://neo4j:plexis@www.neo4j.com";
var httpUrlForTransaction = 'http://localhost:7474/db/data/transaction/commit';
var d3 = require("d3"),
    jsdom = require("jsdom");

var document = jsdom.jsdom(),
    svg = d3.select(document.body).append("svg");

    var express = require('express')
    var serveStatic = require('serve-static')

    app.get('/', function (req, res) {
      res.render('index', {});
    });

    var staticBasePath = './';

    var app = express()

    app.use(serveStatic(staticBasePath, {'index': false}))
    app.listen(80);
