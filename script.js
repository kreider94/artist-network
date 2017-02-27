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


            function getUserData(usr, like, usrs) {
                user = usr;

                SC.get("/users/" + me.id + "/favorites").then(function(tracks) {
                    for (var i = 0; i < tracks.length; i++) {
                        like.push(tracks[i]);
                    }
                });

                SC.get("/users/" + me.id + "/followings", {
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
    deleteNodes();
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

function runAjax(query, callback) {
    $.ajax({
        type: 'POST',
        url: 'http://plexis.org:7474/db/data/transaction/commit',
        headers: {
            "Authorization": "Basic bmVvNGo6cGxleGlz",
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        data: query,
        success: function(data) {
            callback(data);
        }
    });
}

function deleteNodes() {

    var delnodes = {
        statements: [{
            statement: "MATCH (n) OPTIONAL MATCH (n)-[r]-() DELETE n,r"
        }]
    }

    var datadel = JSON.stringify(delnodes);

    function callbackTester(callback) {
        callback();
    };

    callbackTester (function(){
      runAjax(datadel,function(output){
        return output;
      })
    });
}

function requery(query) {

    var que = {
        statements: [{
            statement: query
        }]
    }

    var datastr = JSON.stringify(que);

    function callbackTester(callback) {
        callback();
    };

    callbackTester (function(){
      runAjax(datastr,function(output){
        return output;
      })
    });
}

function common(user, arr, callback) {
    var origLen = arr.length,
        found, x, y;

    var data = [];
    for (x = 0; x < usersList.length; x++) {
        found = undefined;
        for (y = 0; y < arr.length; y++) {
            if (usersList[x].id === arr[y].id) {
                found = true;
                data.push(arr[y]);
            }
        }
    }
    callback(data);
}

function comparray(user, arr, callback) {
    var results = [];

    common(user, arr, function(results) {
        callback(results);
    })
}

function runCypherQuery(arr, callback) {
    var data = arr;
    var query = [];

    for (var i = 0; i < arr.length; i++) {
        query[i] = "CREATE (u:User {id: " + arr[i].id + ", username: '" + arr[i].username + "', permalink: '" + arr[i].permalink + "', avatar: '" + arr[i].avatar_url + "', ranking: " + arr[i].ranking + " })";
        requery(query[i]);
    }
    callback(data);
}

function createRelationships(arr, user) {
    // match user with every element in array where element exists in database
    var query = []
    count = 0;
    for (var i = 0; i < arr.length; i++) {
        if (user.id != arr[i].id) {
            query[i] = "MATCH (a:User {id: " + user.id + " } ),(b:User {id: " + arr[i].id + " }) CREATE (a)-[r:LIKES{weight:2}]->(b) RETURN a,r,b";
            console.log(query[i]);
            requery(query[i]);
            count++
        }
    }
    if(count != arr.length){
      setTimeout(checkNeo(count), 100);
    }
}

function checkNeo(arr){

  var getrelcount = {
      statements: [{
          statement: "MATCH (a)-[r:LIKES]->(b) WITH count(b) as rels RETURN rels"
      }]
  }
  var check = JSON.stringify(getrelcount);
  var num;

  function callbackTester(callback) {
      callback();
  };
  console.log(arr.length);
  console.log("function runninggg")
  callbackTester (function(){
    runAjax(check,function(output){
      return num = output.results[0];
      console.log(num);
    })
  });

  if(num != arr.length){
    setTimeout(callbackTester,100);
  }else{
    returnGraph();
  }
}

function returnGraph() {

    var resgraph = {
        statements: [{
            statement: "MATCH path = (n)-[r]->(m) RETURN path",
            "resultDataContents": ["graph"]
        }]
    }

    var resg = JSON.stringify(resgraph);

    function callbackTester(callback) {
        callback();
    };

    callbackTester (function(){
      runAjax(resg,function(output){
        return reslt = output;
      })
    });

     //get links and nodes from results
    function idIndex(a, id) {
        for (var i = 0; i < a.length; i++) {
            if (a[i].id == id) return i;
        }
        return null;
    }

    var nodes = [],
        links = [];
    reslt.results[0].data.forEach(function(row) {
        row.graph.nodes.forEach(function(n) {
            if (idIndex(nodes, n.id) == null)
                nodes.push({
                    id: n.id,
                    label: n.labels[0],
                    title: n.properties.username,
                    avatar: n.properties.avatar,
                    ranking: n.properties.ranking,
                    permalink: n.properties.permalink
                });
        });
        links = links.concat(row.graph.relationships.map(function(r) {
            return {
                source: idIndex(nodes, r.startNode),
                target: idIndex(nodes, r.endNode),
                type: r.type,
                weight: 2
            };
        }));
    });
    viz = {
        nodes: nodes,
        links: links
    };
    data = JSON.stringify(viz);
    makeNetwork(viz);
};
