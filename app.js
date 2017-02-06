/**
 * Created by kirstinreid on 02/02/2017.
 */
var express = require("express");

/**
, http = require('http');
var script = require('./script.js');
require('./sortdata.js');
require('./index.html');
require('./main.css');
require('./positions.js');
require('./newuser.js');
require('./mainuser.js');
require('./callback.html');
**/
var app = express();

http = require('http');

app.get('/index.html', function (req, res) {
    res.send('index.html')
});

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + "/index.html"));
});


fs.readFile('./index.html', function (err, html) {
    if (err) {
        throw err;
    }
    http.createServer(function(request, response) {
        response.writeHeader(200, {"Content-Type": "text/html"});
        response.write(html);
        response.end();
    }).listen(8000);
});
