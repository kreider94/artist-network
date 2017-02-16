var mainuser;
var mainData = [];
var usersList = [];
var likes = [];
var followingList = [];
var likesUsers = [];
var positions = [];
var divArray = [];
var posElem = [];
var userDP;
var newUser;
var hidden = false;

var WaitForSoundcloud = function () {

    if (typeof SC == "undefined") {
        setTimeout(WaitForSoundcloud, 500);
    } else {
        var wait = true;

        function setWait() {
            wait = false;
        }

        SC.initialize({
            client_id: "235BeLHSHTyBwKe6AfUVBZT6kBleLCYY",
            client_secret: "AwXJaNToU9Oq5fG65fuOkaJVxhIreAxI",
            redirect_uri: "http://localhost/artist-network/callback.html"
        });

        var surl;

        SC.connect().then(function () {
            return SC.get("/me");
        }).then(function (me) {
            surl = "http://soundcloud.com/" + me.permalink;
            document.getElementById("btn");
            mainuser = me;

            document.getElementById("username").innerHTML = me.username;
            document.getElementById("description").innerHTML = me.description;

            function getUserData() {
                SC.get("/users/" + me.id + "/favorites").then(function (tracks) {
                    for (var i = 0; i < tracks.length; i++) {
                        likes.push(tracks[i]);
                    }
                });

                SC.get("/users/" + me.id + "/followings", {limit: 200, linked_partitioning: 1}).then(function(users) {
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

            setWait();
            getUserData();
            generateUserIcon();

            document.getElementById("followers").innerHTML = me.followers_count;
            document.getElementById("following").innerHTML = me.followings_count;
            document.getElementById("tracks").innerHTML = me.track_count;

            if (wait) {
                setTimeout(ShowData(mainuser), 100);
            }

            document.getElementById('login-sc').style.visibility = 'hidden';
            hidden = !hidden;
            if (hidden) {
                document.getElementById('togglee').style.visibility = 'hidden';
            } else {
                document.getElementById('togglee').style.visibility = 'visible';
            }
        });
    }
};

function openNav() {
    document.getElementById("sideNav").style.width = "250px";
    document.getElementById("main").style.marginLeft = "250px";
    var titleRow = document.createElement('td');
    titleRow.innerHTML = mainuser.followers_count;
    document.body.appendChild(titleRow);
}

/* Set the width of the side navigation to 0 and the left margin of the page content to 0 */
function closeNav() {
    document.getElementById("sideNav").style.width = "0";
    document.getElementById("main").style.marginLeft = "0";
}

function getExtraData(arr) {

    for (var i = 0; i < arr.length; i++) {

        const user = arr[i];

        user.artists = [];

        var params = {limit: 60};

        getTracks(user, function (tracks) {
            getFollowings(user, function (followings) {
                likesToUsers(tracks, function (likesUsers) {
                    getNewFinalData(likesUsers, followings, function (final) {
                        unique(final, function (uniques) {
                            removeIfTooMany(uniques, function (final60) {
                                concat(final60, user, function (result) {
                                  generateQuery(result, function(query){
                                    runCypherQueryMatch(query, params, function (result){
                                      return result;
                                    });
                                  });
                                });
                            });
                        });
                    });
                });
            });
        });
    }

}


function ShowData(user) {

          likesToUsers(likes, function (likesUsers) {
              getFinalData(likesUsers, followingList, function (final) {
                  unique(final, function (uniques) {
                    removeLowFollowing(uniques, function(lowfol){
                      removeLowTrackCount(lowfol, function(lowtrack){
                        removeIfTooMany(lowtrack, function (final60) {
                          assignArray(final60, function(finaldata){
                            getExtraData(finaldata);
                            });
                          });
                        })
                      })
                    });
                  });
                });

}

/**
    likesToUsers(likes, likesUsers);
    getFinalData(likesUsers, followingList, usersList);
    setRanking(usersList);
    mainData.sort(sortOn("username"));
    unique(mainData, usersList);
    removeLowFollowers(usersList);
    removeLowTrackCount(usersList);
    removeLowReposts(usersList);
    increaseRanking(usersList);
    removeIfTooMany(usersList);
**/
