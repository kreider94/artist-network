/**
 * Created by kirstinreid on 02/02/2017.
 */


var express = require("express");
var neo4j = require('neo4j-driver').v1;

var app = express();

var server = app.listen(listening);

function listening(){
    console.log("listening...");
}


app.use(express.static('artist-network'));

/**
app.get('/index.html', function (req, res) {
    res.send('index.html')
});

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + "/index.html"));
});
**/

var driver = neo4j.driver("bolt://localhost:7687", neo4j.auth.basic("neo4j", "neo4j"));
var session = driver.session();
