
function currUserInfo(avatar,username){
  var pic = document.getElementById('curruser');
  var largeavatar = avatar.replace("large", "t500x500");
  console.log(largeavatar);
  pic.style.backgroundImage = "url('" + largeavatar + "')";
  document.getElementById('currname').innerHTML = username;
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
    arr.sort(sortOn("ranking"));
    while(arr.length > 70){
        arr.splice(1,1);
    }
    callback(arr);
}

function concat(arr, final, callback) {

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

function getPagePlaylist(){
  var pagePlaylist = [];
  for (var i = 0; i < usersList.length; i++) {
    SC.get("/users/" + usersList[i].id + "/tracks").then(function (tracks) {
       tracks.sort(sortOn("favoritings_count"));
       tracks.sort(sortOn("comment_count"));
       tracks.sort(sortOn("reposts_count"));
       pagePlaylist.push(tracks[tracks.length-1]);
      });
    }

  //  populatePlaylist(pagePlaylist);
}

function getArtistTrack(user){
  var topTrack = 0;
  var id = user.userid
  SC.get("/users/" + id + "/tracks").then(function (tracks) {
     tracks.sort(sortOn("favoritings_count"));
     tracks.sort(sortOn("comment_count"));
     tracks.sort(sortOn("reposts_count"));
     tracks.reverse();
     for (var i = 0; i < tracks.length; i++) {
       if(tracks[i].duration < 720000){
         topTrack = tracks[i];
         break;
       }
     }
     if(topTrack != 0){
       document.getElementById('deezer-widget').src = "";
       document.getElementById('sc-widget').src = "https://w.soundcloud.com/player/?url=http://api.soundcloud.com/tracks/" + topTrack.id;
       document.getElementById('sc-widget').style.visibility = "visible";
    }else{
        deezerTrack(user.title);
    }
  })
}


function deezerTrack(query) {
    $.ajax({
        url: ' http://api.deezer.com/search/autocomplete?q=' + query,
        success: function (response) {
          console.log(response);
          var track = "http://www.deezer.com/plugins/player?format=classic&autoplay=true&playlist=true&width=700&height=115&color=007FEB&layout=dark&size=small&type=radio&id=artist-" + response.artists.data[0].id + "&appid=1";
          document.getElementById('sc-widget').style.visibility = "hidden";
          document.getElementById('deezer-widget').src = track;
        }
    });
};
            // console.log(response.tracks.items[0].preview_url);
function checkIfFollowing(user,curr){
      for (var u = 0; u < alreadyfollowing.length; u++) {
          if(curr.id === alreadyfollowing[u].id){
            $("#followbtn").attr("src","/images/following.png");
            console.log("already following user");
            following = true;
            break;
          }
          else{
            $("#followbtn").attr("src","/images/follow.png");
          }
      }
}

// function followUnfollowUser(user,curr){
//       if(following = true){
//         unfollowUser(user,curr);
//       }
//
//       if(following = false){
//         followUser(user,curr);
//       }
//   }
//
//       function unfollowUser(user,curr){
//         SC.connect().then(function() {
//           SC.put('/me/followings/' + curr.id).then(function(){
//             following = false;
//             return SC.delete('/me/followings/' + curr.id)
//           }).then(function(user){
//               console.log('You unfollowed ' + user.username);
//             }).catch(function(error){
//               alert('Error: ' + error.message);
//             });
//         });
//         $("followbtn").attr("src","/images/follow.png");
//       }



    function followUser(user,curr){
      SC.connect().then(function() {
        following = true;
        return SC.put('/me/followings/' + curr.id);
      }).then(function(user){
          alert('You are now following ' + user.username);
        }).catch(function(error){
          alert('Error: ' + error.message);
        });
      $("followbtn").attr("src","/images/following.png");
    }
