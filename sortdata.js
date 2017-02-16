var cityArr = [];


function likesToUsers(arr, likesUsr) {
    for (var i = 0; i < arr.length; i++) {
        likesUsr.push(arr[i].user);
    }
}

function getFinalData(a, b, callback) {
  var data = [];
    data = a.concat(b).sort(sortOn("username"));
  callback(data);
}

function setRanking(arr, callback) {
  var data = [];
    for (var i = 0; i < arr.length; i++) {
         data = (arr[i].ranking = 0);
    }
    callback(data);
}

function sortOn(property) {
    return function (a, b) {
        if (a[property] < b[property]) {
            return -1;
        } else if (a[property] > b[property]) {
            return 1;
        } else {
            return 0;
        }
    };
}

function unique(arr, returnArr) {
    var origLen = arr.length,
        found, x, y;

    for (x = 0; x < origLen; x++) {
        found = undefined;
        for (y = 0; y < returnArr.length; y++) {
            if (arr[x].username === returnArr[y].username) {
                returnArr[y].ranking++;
                found = true;
                break;
            }
        }
        if (!found) {
            returnArr.push(arr[x]);
        }
    }
    returnArr;
}

function increaseRanking(arr){
    for(i=0; i < arr.length; i++){
        if(arr[i].followers_count > 10000){
           arr[i].ranking++;
         }
    }
}

//remove users with low following count
function removeLowFollowers(array, callback) {
  var data = [];
    for (var i = 0; i < array.length; i++) {
        if (array[i].followers_count < array[i].followings_count || array[i].followers_count === 0) {
             data = (array.splice(i, 1));
        }
    }
    callback(data);
}

function removeLowFollowing(array, callback){
    for (var i = 0; i < array.length; i++) {
       if(array[i].followings_count < 10){
             array.splice(i,1);
       }
    }
    callback(array);
}

//decrease if ranking is 0
function removeLowReposts(array, callback) {
  var data = [];
    for (var i = 0; i < array.length; i++) {
        if (array[i].reposts_count === 0) {
            data = (array.splice(i, 1));
        }
    }
    callback(data);
}

function removeLowTrackCount(array, callback) {
    for (var i = 0; i < array.length; i++) {
        if (array[i].track_count < 15) {
            array.splice(i, 1);
        }
    }
    callback(array);
}

function removeIfTooMany(arr, callback){
  var data = [];
    arr.sort(sortOn("ranking"));
    arr.sort(sortOn("followers_count"));
    arr.sort(sortOn("reposts_count"));
    while(arr.length > 60){
        data = (arr.splice(1,1));
    }
    callback(data);

}
