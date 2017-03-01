
function currUserInfo(avatar){
  var pic = document.getElementById('curruser');
  var largeavatar = avatar.replace("large", "t500x500");
  console.log(largeavatar);
  pic.style.backgroundImage = "url('" + largeavatar + "')";
}

function getTracks(newUser, callback){
    var data=[];
    SC.get("/users/" + newUser.id + "/favorites").then(function (tracks) {
        for (var i = 0; i < tracks.length; i++) {
            data.push(tracks[i]);
        }
        callback(data);
    });
}

function getFollowings(newUser, callback){
    var data =[];
    SC.get("/users/" + newUser.id + "/followings",{limit: 200, linked_partitioning: 1}).then(function (users) {
        for (var u = 0; u < users.collection.length; u++) {
            data.push(users.collection[u]);
        }
        callback(data);
    });
}

function likesToUsers(arr, callback) {
    var data = [];
    for (var i = 0; i < arr.length; i++) {
        data.push(arr[i].user);
    }
    callback(data);
}

function getFinalData(a, b, callback) {
  var data = [];
    data = a.concat(b);
    for (var i = 0; i < data.length; i++) {
      data[i].ranking = 1;
    }
  callback(data);
}

function getNewFinalData(a, b, callback) {
    var data=[];
    data = a.concat(b);
    callback(data);
}

function unique(arr, callback) {
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

function removeIfTooMany(arr, callback){
    arr.sort(sortOn("followers_count"));
    arr.sort(sortOn("reposts_count"));
    while(arr.length > 70){
        arr.splice(1,1);
    }
    callback(arr);
}

function concat(arr, final, callback) {
    //var data = [];

    for (var p = 0; p < arr.length; p++) {
        final.artists[p] = arr[p];
    }
    callback(final.artists);
}

function assignArray(b, callback){
  usersList = [];
  for(var i = 0; i < b.length; i++){
    usersList[i] = b[i];
  }
  usersList.sort(sortOn("username"));
  callback(usersList);
}

function getArtistTrack(id){
  var topTrack;
  SC.get("/users/" + id + "/tracks").then(function (tracks) {
      topTrack = tracks[0].uri
      document.getElementById('sc-widget').src = "https://w.soundcloud.com/player/?url=http://api.soundcloud.com/tracks/" + tracks[0].id;
    })
    changeSound(topTrack);
}

function checkIfFollowing(user,curr){
      for (var u = 0; u < alreadyfollowing.length; u++) {
          if(curr.id === alreadyfollowing[u].id){
            document.getElementById("followbtn").src = "following.png";
            console.log("already following user");
            following = true;
            break;
          }
      }
}

function followUnfollowUser(user,curr){
  var me = mainuser

      if(following = true){
        unfollowUser();
      }

      if(following = false){
        followUser();
      }

      function unfollowUser(){
        SC.connect().then(function() {
          SC.put('/me/followings/' + curr.id).then(function(){
            following = false;
            return SC.delete('/me/followings/' + curr.id)
          }).then(function(user){
              console.log('You unfollowed ' + user.username);
            }).catch(function(error){
              alert('Error: ' + error.message);
            });
        });
        document.getElementById('followbtn').src = "follow.png";
      }

      function followUser(){
        SC.connect().then(function() {
          following = true;
          return SC.put('/me/followings/' + curr.id);
        }).then(function(user){
            alert('You are now following ' + user.username);
          }).catch(function(error){
            alert('Error: ' + error.message);
          });
        document.getElementById('followbtn').src = "unfollow.png";
      }
    }
  //
  // if(following = false){
  // SC.connect().then(function(){
  //     following = true;
  //      SC.put('/me/followings/' + curr.id);
  //   }).then(function(user){
  //     console.log('You are now following user');
  //   }).catch(function(error){
  //     alert('Error: ' + error.message);
  //   });
  // }
