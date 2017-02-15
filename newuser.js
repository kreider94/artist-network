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
    data=[];
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
                data[y].ranking++;
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

function getNewUserData(index, ShowData) {
    removeElementsByClass('pos');
    alert(index);

    getNewUser(index, newData);

    
    (function() {
        SC.get('"/' + newUser + '"');
    });

    alert(newUser.username);
    clearArrays();
    getNewTracks(newUser);
    getNewFollowings(newUser);
    ShowData(newUser);

};
