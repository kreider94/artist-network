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
var count = 0;
var viz;
var reslt;
var data;
var current;
var alreadyfollowing = [];
var following = false;

function WaitForSoundcloud() {

    if (typeof SC == "undefined") {
        setTimeout(WaitForSoundcloud, 500);
    } else {
        SC.initialize({
            client_id: "m3kCd053xVXYtaEYQZ2e87SWSSuYnunA",
            client_secret: "Ur0s170Mz0aorJO700TOSY7qwdTWbv6i",
            redirect_uri: "http://plexis.org/callback.html"
        });

        var surl;

        SC.connect().then(function() {
            return SC.get("/me");
        }).then(function(me) {
            surl = "http://soundcloud.com/" + me.permalink;
            document.getElementById("btn");
            mainuser = me;
            var followlength
            var tracklength;

            var track_url = 'http://soundcloud.com/forss/flickermood';
            SC.oEmbed(track_url, { auto_play: true }).then(function(oEmbed) {
              console.log('oEmbed response: ', oEmbed);
            });

            function getUserData(usr, like, usrs) {
                user = usr;

                SC.get("/users/" + me.id + "/favorites").then(function(tracks) {
                    tracklength = tracks.length;
                    for (var i = 0; i < tracks.length; i++) {
                        like.push(tracks[i]);
                    }
                });

                SC.get("/users/" + me.id + "/followings", {
                    limit: 200,
                    linked_partitioning: 1
                }).then(function(users) {
                    followlength = users.collection.length;
                    for (var u = 0; u < users.collection.length; u++) {
                        usrs.push(users.collection[u]);
                    }
                });
            }

            //document.getElementById("id").innerHTML = mainuser.id;

            function checkArrs(){
              if(tracklength != likes.length || followlength != followingList.length){
                setTimeout(checkArrs,100);
              }else{
                ShowData(mainuser);
              }
            }

            getUserData(mainuser, likes, followingList);
            checkArrs();

            alreadyfollowing = followingList;
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
    current = user;
    deleteNodes();
    var avatar = user.avatar_url;
    currUserInfo(avatar,user.username);
    checkIfFollowing(mainuser,user);
  //  getPagePlaylist();
    likesToUsers(likes, function(likesUsers) {
        getFinalData(likesUsers, followingList, function(final) {
            unique(final, function(uniques) {
                removeLowFollowing(uniques, function(lowfol) {
                    removeLowFollowers(lowfol, function(lowtrack) {
                        removeLowReposts(lowtrack, function(lowrep) {
                            removeLowTrackCount(lowrep, function(lowtra) {
                                removeIfTooMany(lowtra, function(final60) {
                                  increaseRanking(final60, function(ranking){
                                      assignArray(ranking, function(finaldata) {
                                        runCypherQuery(finaldata, function(queries) {
                                            getExtraData(queries);
                                        });
                                    });
                                });
                            });
                        });
                    })
                })
            });
        });
    });
});
}

function getExtraData(arr) {

    for (var i = 0; i < arr.length; i++) {
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
                                    comparray(user, result, function(finals) {
                                        createRelationships(finals, user);
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
