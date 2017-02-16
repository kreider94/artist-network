var httpUrlForTransaction = 'http://localhost:7474/db/data/transaction/commit';

function getTracks(newUser, callback){
    var data=[];
    SC.get("/users/" + newUser.id + "/favorites").then(function (tracks) {
        for (var i = 0; i < tracks.length; i++) {
            data.push(tracks[i]);
        }
        callback(data);
    });
}

function getFollowings(newUser, callback){
    var data =[];
    SC.get("/users/" + newUser.id + "/followings",{limit: 200, linked_partitioning: 1}).then(function (users) {
        for (var u = 0; u < users.collection.length; u++) {
            data.push(users.collection[u]);
        }
        callback(data);
    });
}

function likesToUsers(arr, callback) {
    var data = [];
    for (var i = 0; i < arr.length; i++) {
        data.push(arr[i].user);
    }
    callback(data);
}

function getFinalData(a, b, callback) {
  var data = [];
    data = a.concat(b).sort(sortOn("username"));
  callback(data);
}

function getNewFinalData(a, b, callback) {
    var data=[];
    data = a.concat(b);
    callback(data);
}

function unique(arr, callback) {
    var origLen = arr.length,
        found, x, y;

    var data = [];
    for (x = 0; x < origLen; x++) {
        found = undefined;
        for (y = 0; y < data.length; y++) {
            if (arr[x].username === data[y].username) {
                found = true;
                break;
            }
        }
        if (!found) {
            data.push(arr[x]);
        }
    }
    callback(data);
}

function removeIfTooMany(arr, callback){
    arr.sort(sortOn("followers_count"));
    arr.sort(sortOn("reposts_count"));
    while(arr.length > 60){
        arr.splice(1,1);
    }
    callback(arr);
}

function concat(arr, final, callback) {
    //var data = [];

    for (var p = 0; p < arr.length; p++) {
        final.artists[p] = arr[p];
    }
    callback(final.artists);
}

function assignArray(b, callback){
  for(var i = 0; i < b.length; i++){
    usersList[i] = b[i];
  }
  callback(usersList);
}

function runCreateNode(user){
    db.insertNode({
      id: user.id,
      username: user.username
    },function(err,node){
      if(err) throw err;

      console.log(node.data);
    });
}

function generateQuery(arr, callback){
    var query = [];

    for(var i=0; i < arr.length; i++){
      query[i] = "CREATE (u:User {id:" + arr[i].id + "}) RETURN u";
    }
    callback(query);
}

function runCypherQueryMatch(arr, params,callback) {
/**
  var cb = function(err,data) {
    console.log(JSON.stringify(arr))
  }
**/
  for(var i = 0; i < arr.length; i++){
        var query = arr[i];
        console.log(query);
        var params = {limit: 60};
        request.post({
                uri: httpUrlForTransaction,
                json: {statements: [{statement: query, parameters:params}]}
            },
            function (err, res) {
                cb(err, res.body);
                console.log(res.body);
            })
          }
}
