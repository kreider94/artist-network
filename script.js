var mainuser;
var mainData = [];
var likesUsers = [];
var likes = [];
var followingList = [];
var positions = [];
var divArray = [];
var posElem = [];
var usersList = [];
var userDP;
var newUser;
var hidden = false;

function WaitForSoundcloud() {

    if (typeof SC == "undefined") {
        setTimeout(WaitForSoundcloud, 500);
    } else {
        SC.initialize({
            client_id: "235BeLHSHTyBwKe6AfUVBZT6kBleLCYY",
            client_secret: "AwXJaNToU9Oq5fG65fuOkaJVxhIreAxI",
            redirect_uri: "http://localhost/artist-network/callback.html"
        });

        var surl;

        SC.connect().then(function() {
            return SC.get("/me");
        }).then(function(me) {
            surl = "http://soundcloud.com/" + me.permalink;
            document.getElementById("btn");
            mainuser = me;


            function getUserData(usr, like, usrs) {
                user = usr;
                SC.get("/users/" + user.id + "/favorites").then(function(tracks) {
                    for (var i = 0; i < tracks.length; i++) {
                        like.push(tracks[i]);
                    }
                });

                SC.get("/users/" + user.id + "/followings", {
                    limit: 200,
                    linked_partitioning: 1
                }).then(function(users) {
                    for (var u = 0; u < users.collection.length; u++) {
                        usrs.push(users.collection[u]);
                    }
                });
            }

            document.getElementById("username").innerHTML = me.username;
            document.getElementById("description").innerHTML = me.description;

            function generateUserIcon() {
                userDP = document.getElementById('dp');
                userDP.style.backgroundImage = "url('" + me.avatar_url + "')";
                userDP.style.backgroundRepeat = "no-repeat";
                userDP.style.fontSize = "100px";
                userDP.style.display = "inline-block";
                userDP.style.position = "center";
            }

            getUserData(mainuser, likes, followingList);
            generateUserIcon();

            document.getElementById("followers").innerHTML = me.followers_count;
            document.getElementById("following").innerHTML = me.followings_count;
            document.getElementById("tracks").innerHTML = me.track_count;
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

function ShowData(user) {

    likesToUsers(likes, function(likesUsers) {
        getFinalData(likesUsers, followingList, function(final) {
            unique(final, function(uniques) {
                removeLowFollowing(uniques, function(lowfol) {
                    removeLowTrackCount(lowfol, function(lowtrack) {
                        removeIfTooMany(lowtrack, function(final60) {
                            assignArray(final60, function(finaldata) {
                                runCypherQuery(finaldata);
                                getExtraData(finaldata);
                            });
                        });
                    })
                })
            });
        });
    });
}

function getExtraData(arr) {

    for (var i = 0; i < arr.lengcth; i++) {
        const user = arr[i];
        user.artists = [];
        var params = {
            limit: 60
        };

        getTracks(user, function(tracks) {
            getFollowings(user, function(followings) {
                likesToUsers(tracks, function(likesUsers) {
                    getNewFinalData(likesUsers, followings, function(final) {
                        unique(final, function(uniques) {
                            removeIfTooMany(uniques, function(final60) {
                                concat(final60, user, function(result) {
                                    comparray(result,function(finals){
                                        runCypherQuery(finals);
                                      });
                                    });
                                });
                            });
                        });
                    });
                });
            });
    };
}

function deleteNodes(){

      var delnodes = {
        statements:[{
          statement: "MATCH (n) OPTIONAL MATCH (n)-[r]-() DELETE n,r"
        }]
      }

      var datadel = JSON.stringify(delnodes);

      $.ajax({
          type: 'POST',
          url: 'http://localhost:7474/db/data/transaction/commit',
          headers: {
              "Authorization": "Basic bmVvNGo6cGxleGlz",
              'Accept': 'application/json',
              'Content-Type': 'application/json'
          },
          url: 'http://localhost:7474/db/data/transaction/commit',
          data: datadel
      }, function(err, res, body) {
          console.log(body);
          console.log(res);
          console.log(err);
      })
}

function requery(query) {

      var que = {
        statements:[{
          statement: query
        }]
      }

      var datastr = JSON.stringify(que);

        $.ajax({
            type: 'POST',
            url: 'http://localhost:7474/db/data/transaction/commit',
            headers: {
                "Authorization": "Basic bmVvNGo6cGxleGlz",
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            url: 'http://localhost:7474/db/data/transaction/commit',
            data: datastr
        }, function(err, res, body) {
            //console.log(body);
            //console.log(res);
            //console.log(err);
        })
}

function comparray(arr, callback){

  var results = [];
  console.log(arr);
    for (var i = 0, j = arr.length; !found && i < j; i++) {
            if (usersList.indexOf(arr[i]) > -1) {
                results.push(arr[i]);
                console.log(results);
            }
    }
    callback(results);
  }

function runCypherQuery(arr) {
    deleteNodes();
    var query = [];

    for (var i = 0; i < arr.length; i++) {
        query[i] = "CREATE (u {id:" + arr[i].id + "})";
        requery(query[i]);
      }
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
