

function getUserData() {
    SC.get("/users/" + me.id + "/favorites").then(function (tracks) {
        for (var i = 0; i < tracks.length; i++) {
            likes.push(tracks[i]);
        }
    });

    SC.get("/users/" + me.id + "/followings", {limit: 200, linked_partitioning: 1}).then(function (users) {
        for (var u = 0; u < users.collection.length; u++) {
            followingList.push(users.collection[u]);
        }
    });

}

function generateUserIcon() {
    userDP = document.getElementById('dp');
    userDP.style.backgroundImage = "url('" + me.avatar_url + "')";
    userDP.style.backgroundRepeat = "no-repeat";
    userDP.style.fontSize = "100px";
    userDP.style.display = "inline-block";
    userDP.style.position = "center";
}