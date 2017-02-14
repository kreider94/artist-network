/**
 * Created by kirstinreid on 02/02/2017.
 */


var express = require("express");
var neo4j = require('neo4j-driver').v1;
var path = require("path");
var logger = require('morgan');
var bodyParser = require('body-parser');

var app = express();


app.use(express.static('artist-network'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

var driver = neo4j.driver('bolt://localhost', neo4j.auth.basic('neo4j', 'mackie11'));
var session = driver.session();

app.get('/', function (req, res) {
    session
        .run("MATCH (Pig&Dan {username : {username}}) RETURN Pig&Dan.country", {username:'Pig&Dan'})
        .then(function(result){
                console.log(result);
        })
        .catch(function(err){
            console.log(err);
    });
    res.send('./index.html')
});


function listening(){
    console.log("listening...");
}

app.listen(listening);

module.exports = app;

/**
var db = new neo4j.GraphDatabase('http://neo4j:mackie11@localhost:7474');

db.cypher({
    query: 'MATCH (username:Username {country: {country}}) RETURN username',
    params: {
        country: 'Germany',
    },
}, callback);

function callback(err, results) {
    if (err) throw err;
    var result = results[0];
    if (!result) {
        console.log('No user found.');
    } else {
        var user = result['username'];
        console.log(user);
    }
};

//Create a driver with multiple routing URIs
public Driver acquireDriver(List<String> uris, AuthToken authToken, Config config)
{
    for (String uri : uris)
    {
        try {
            return GraphDatabase.driver(uri, authToken, config);
        }
        catch (ServiceUnavailableException ex)
        {
            // This URI failed, so loop around again if we have another.
        }
    }
    throw new ServiceUnavailableException("No valid database URI found");
}
 **/