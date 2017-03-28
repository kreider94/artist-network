const async = require('async');
var queryDB = require('./dbconnect.js').query;

exports.CreateUser = function(id, username, permalink_uri, result, callback) {
    queryDB(
        "MERGE (user : User {id : {user_id}, username : {usrname}, permalink_uri : {perma} " +
        "ON MERGE RETURN TRUE", // return true if user already exists
        {
            user_id: id,
            usrname: username,
            permalink_uri: perma
        },
        result,
        callback);
};
