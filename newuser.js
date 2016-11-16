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


function getNewTracks(newUser){
    SC.get("/users/" + newUser.id + "/favorites").then(function (tracks) {
        likes = [];
        for (var i = 0; i < tracks.length; i++) {
            likes.push(tracks[i]);
        }
    });
}

function getNewFollowings(newUser){
    SC.get("/users/" + newUser.id + "/followings", {limit: 200, linked_partitioning: 1}).then(function (users) {
        followingList = [];
        for (var u = 0; u < users.collection.length; u++) {
            followingList.push(users.collection[u]);
        }
    });
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
