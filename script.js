var mainuser;
var title = [];
var mainData = [];
var newData = [];
var out = [];
var likes = [];
var followingList = [];
var likesUsers = [];
var positions = [];
var divArray = [];
var myListeners = [];
var posElem = [];
var userDP;
var newUser;
var multiples = [];
var hidden = false;

var WaitForSoundcloud = function() {

    if (typeof SC == "undefined") {
        setTimeout(WaitForSoundcloud, 500);
    } else {
        var wait = true;

        function setWait(){
            wait = false;
        }

        SC.initialize({
            client_id: "03a1e1175d17faaa55945f7a7f007363",
            client_secret: "c4f36a07382bab9f91da20918099c9de",
            redirect_uri: "http://plexis.org.preview.services/callback.html"
        });

        var surl;

        SC.connect().then(function () {
            return SC.get("/me");
        }).then(function (me) {
            surl = "http://soundcloud.com/" + me.permalink;
            document.getElementById("btn")
            mainuser = me;

            document.getElementById("username").innerHTML = me.username;
            document.getElementById("description").innerHTML = me.description;

            function getUserData() {
                SC.get("/users/" + me.id + "/favorites").then(function (tracks) {
                    for (var i = 0; i < tracks.length; i++) {
                        likes.push(tracks[i]);
                    }
                });

                SC.get("/users/" + me.id + "/followings", {limit: 200, linked_partitioning: 1}).then(function (users) {
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
                setTimeout(waitForIt(),100);
            } else {
                ShowData(mainuser);
            }

        document.getElementById('login-sc').style.visibility = 'hidden';
                   hidden = !hidden;
        if(hidden) {
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

function removeElementsByClass(className) {
    var elements = document.getElementsByClassName(className);
    alert("amount to remove is " + elements.length);
    while (elements.length > 0) {
        elements[0].parentNode.removeChild(elements[0]);
    }
}

function ShowData(user) {

    likesToUsers(likes);
    getFinalData(likesUsers, followingList);
    setRanking();
    mainData.sort(sortOn("username"));
    unique(mainData);
    removeLowFollowers(newData);
    removeLowTrackCount(newData);
    removeLowReposts(newData);
    increaseRanking(newData);
    removeIfTooMany(newData);
    //positionElements();

    
    generatePosElements(newData);

function splitAndPosition(){

var active = false;

function splitAll(){
    
    splitArrays(small, smallXtra, 500, 80);
    splitArrays(med, medXtra, 400, 93);
    splitArrays(large, largeXtra, 100,105);

    active = true;
};
 getSound();

function positionElem(){

if(active = false){
setTimeout(positionElem, 200);
}else{
posE(small, 620, 620,80);
posE(smallXtra, 440,540, 80);
posE(med, 380, 500, 93);
posE(medXtra, 750, 750, 93);
posE(large, 110,110, 105);
posE(largeXtra, 200,300,105);
console.log(smallXtra.length);
console.log(medXtra.length);
}
}
splitAll();
positionElem();
}


splitAndPosition();

}



