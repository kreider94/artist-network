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
                      removeLowReposts(lowtrack, function(lowrep){
                        removeLowTrackCount(lowrep, function(lowtra){
                        removeIfTooMany(lowtra, function(final60) {
                            assignArray(final60, function(finaldata) {
                                runCypherQuery(finaldata, function(queries){
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
                                    comparray(user, result,function(finals){
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

function returnGraph(){

  var resgraph = {statements:[{
    statement: "MATCH path = (n)-[r]->(m) RETURN path",
                  "resultDataContents":["graph"]
                }]
              }


    var resg = JSON.stringify(resgraph);
  function testAjax(handleData){
   $.ajax({
      type: 'POST',
      url: 'http://localhost:7474/db/data/transaction/commit',
      headers: {
          "Authorization": "Basic bmVvNGo6cGxleGlz",
          'Accept': 'application/json',
          'Content-Type': 'application/json'
      },
      url: 'http://localhost:7474/db/data/transaction/commit',
      data: resg,
      success:function(data){
        handleData(data);
          }
      });
    }

    testAjax(function(output){
      console.log(output);
      reslt = output
    });

    function idIndex(a,id) {
      for (var i=0;i<a.length;i++) {
        if (a[i].id == id) return i;}
      return null;
    }

    var nodes=[], links=[];

    reslt.results[0].data.forEach(function (row) {
       row.graph.nodes.forEach(function (n) {
         if (idIndex(nodes,n.id) == null)
           nodes.push({id:n.id,label:n.labels[0],title:n.properties.name});
       });
       links = links.concat( row.graph.relationships.map(function(r) {
         return {start:idIndex(nodes,r.startNode),end:idIndex(nodes,r.endNode),type:r.type};
       }));

    });
    viz = {nodes:nodes, links:links};
};


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
    console.log(user.username);
    console.log(data);
    callback(data);
}

function comparray(user, arr, callback){
    var results = [];

    common(user,arr,function(results){
      callback(results);
    })
  }

function runCypherQuery(arr, callback) {
    var data = arr;
    var query = [];

    for (var i = 0; i < arr.length; i++) {
        query[i] = "CREATE (u:User {id: " + arr[i].id + ", username: '" + arr[i].username + "' })";
        requery(query[i]);
      }
      callback(data);
}

function createRelationships(arr,user){
  // match user with every element in array where element exists in database
  var query = []
  for (var i = 0; i < arr.length; i++) {
    if(user.id != arr[i].id){
        query[i] = "MATCH (a:User {id: " + user.id + " } ),(b:User {id: "+ arr[i].id +" }) CREATE (a)-[:LIKES]->(b)";
        console.log(query[i]);
        requery(query[i]);
        count++;
    }
  }
}
