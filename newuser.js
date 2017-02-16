function getNewUser(index, array) {
    var newUser = array[index];
    alert(newUser);
    return newUser;
}

function clearArrays() {
    likesUsers = [];
    likes = [];
    followingList = [];
    positions = [];
    divArray = [];
    posElem = [];
    mainData = [];
    newData = [];
}


function getNewTracks(newUser, callback){
    var data=[];
    SC.get("/users/" + newUser.id + "/favorites").then(function (tracks) {
        for (var i = 0; i < tracks.length; i++) {
            data.push(tracks[i]);
        }
        callback(data);
        // return indlikes;
    });
}

function getNewFollowings(newUser, callback){
    var data =[];
    SC.get("/users/" + newUser.id + "/followings",{limit: 200, linked_partitioning: 1}).then(function (users) {
        for (var u = 0; u < users.collection.length; u++) {
            data.push(users.collection[u]);
        }
        callback(data);
    });
}

function newLikesToUsers(arr, callback) {
    var data = [];
    for (var i = 0; i < arr.length; i++) {
        data.push(arr[i].user);
    }
    callback(data);
}

function getNewFinalData(a, b, callback) {
    var data=[];
    data = a.concat(b);
    callback(data);
}

function newUnique(arr, callback) {
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

function newRemoveIfTooMany(arr, callback){
    arr.sort(sortOn("followers_count"));
    arr.sort(sortOn("reposts_count"));
    while(arr.length > 60){
        arr.splice(1,1);
    }
    callback(arr);
}

function concat(arr, final, callback) {
    var data = [];

    for (var p = 0; p < arr.length; p++) {
        data = (final.artists[p] = arr[p]);
    }
    callback(data);
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
    var query = []
    console.log(arr[i].id);
    for(var i=0; i < arr.length; i++){
      query[i] = "CREATE User (user:User {id:" + arr[i].id + "," + " username: " + arr[i].username + "})";
    }
    callback(query);
}

function runCypherQueryMatch(arr, callback) {

  for(var i =0; i < arr.length; i++){
        request.post({
                uri: httpUrlForTransaction,
                json: {statements: [{statement: arr[i]}]}
            },
            function (err, res, body) {
                callback(err, body);
            })
          }
}
