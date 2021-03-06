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
var visited = [];
var delnodes = "MATCH (n) OPTIONAL MATCH (n)-[r]-() DELETE n,r";

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

            $(".front").css("visibility","hidden");

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

function ShowData(user) {
    current = user;
    requery(delnodes);
    var avatar = user.avatar_url;
    currUserInfo(avatar,user.username);
    checkIfFollowing(mainuser,user);
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
