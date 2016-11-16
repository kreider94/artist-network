function likesToUsers(arr) {
    for (var i = 0; i < arr.length; i++) {
        likesUsers.push(arr[i].user);
    }
}


function getFinalData(a, b) {
    mainData = a.concat(b);
}

function setRanking() {
    for (var i = 0; i < mainData.length; i++) {
        mainData[i].ranking = 0;
    }
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

function unique(arr) {
    var origLen = arr.length,
        found, x, y;

    for (x = 0; x < origLen; x++) {
        found = undefined;
        for (y = 0; y < newData.length; y++) {
            if (arr[x].username === newData[y].username) {
                newData[y].ranking++;
                found = true;
                break;
            }
        }
        if (!found) {
            newData.push(arr[x]);
        }
    }
    return newData;
}

function increaseRanking(arr){
    for(i=0; i < arr.length; i++){
        if(arr[i].followers_count > 10000){
           arr[i].ranking++;
         }
    }
}


//remove users with low following count
function removeLowFollowers(array) {
    for (var i = 0; i < array.length; i++) {
        if (array[i].followers_count < array[i].followings_count || array[i].followers_count === 0) {
            array.splice(i, 1);
        }
    }
}

function removeLowFollowing(array){
    for (var i = 0; i < array.length; i++) {
       if(array[i].followings_count < 10){
            arr.splice(i,1);
       }
    }
}

//decrease if ranking is 0
function removeLowReposts(array) {
    for (var i = 0; i < array.length; i++) {
        if (array[i].reposts_count === 0) {
            array.splice(i, 1);
        }
    }
}

function removeLowTrackCount(array) {
    for (var i = 0; i < array.length; i++) {
        if (array[i].track_count < 15) {
            array.splice(i, 1);
        }
    }
}

function removeIfTooMany(arr){
    arr.sort(sortOn("ranking"));
    arr.sort(sortOn("followers_count"));
    arr.sort(sortOn("reposts_count"));
    while(newData.length > 60){
        arr.splice(1,1);
    }
}