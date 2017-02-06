/**
 * Created by kirstinreid on 02/02/2017.
 */
/**

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

var app = express();

http = require('http');

app.get('/index.html', function (req, res) {
    res.send('index.html')
});

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + "/index.html"));
});
*/

var http = require('http');
var fs = require('fs');
var path = require('path');

http.createServer(function (request, response) {

    console.log('request starting for ');
    console.log(request);

    var filePath = '.' + request.url;
    if (filePath == './')
        filePath = './index.html';

    console.log(filePath);
    var extname = path.extname(filePath);
    var contentType = 'text/html';
    switch (extname) {
        case '.js':
            contentType = 'text/javascript';
            break;
        case '.css':
            contentType = 'text/css';
            break;
    }

    path.exists(filePath, function(exists) {

        if (exists) {
            fs.readFile(filePath, function(error, content) {
                if (error) {
                    response.writeHead(500);
                    response.end();
                }
                else {
                    response.writeHead(200, { 'Content-Type': contentType });
                    response.end(content, 'utf-8');
                }
            });
        }
        else {
            response.writeHead(404);
            response.end();
        }
    });

}).listen(process.env.PORT || 5000);

console.log('Server running at http://127.0.0.1:5000/');