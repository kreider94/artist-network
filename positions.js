var small = [];
var med = [];
var large = [];
var smallXtra = [];
var medXtra = [];
var largeXtra = [];

function generatePosElements(array) {

    for (var j = 0; j < array.length; j++) {
        img = document.createElement('img');
        img.src = 'http://www.freeiconspng.com/uploads/play-button-icon-png-0.png';
        img.id = 'img' + j;
        img.value = 'play';
        div = document.createElement('pos');
        div.className = 'pos';
        div.id = j;
        div.type = "checkbox";
        span = document.createElement('span');
        span.id = "span";
        span.innerHTML = (array[j].username).toUpperCase();

        var spanWidth = 80;
        overlay = document.createElement('overlay');
        overlay.className = 'overlay';

        play = document.createElement('play');
        play.className = 'play';
        if (array[j].ranking === 0) {
            div.style.cssText = 'background: url("' + array[j].avatar_url + '"' + ') repeat center;' + 'width:80px;' + 'height:80px;'
                + 'backgroundSize:cover;';
            small.push(div);
            span.style.cssText = 'fontSize: 9px;';
        } else if (array[j].ranking === 1) {
            div.style.cssText = 'width:93px;' + 'height:93px;' + 'background: url("' + array[j].avatar_url + '"' + ') repeat center;';
            spanWidth = 93;
            med.push(div);
            span.style.cssText = 'fontSize: 10px';
        }
        else {
            div.style.cssText = 'height:105px;' + 'width:105px;' + 'background: url("' + array[j].avatar_url + '"' + ') repeat center;';
            spanWidth = 105;
            large.push(div);
        }
        span.style = 'width: ' + spanWidth + "px";

        //append all elements to each other
        div.appendChild(span);
        play.appendChild(img);
        overlay.appendChild(play);
        div.appendChild(overlay);

        document.getElementById('svg').appendChild(div);
    }
}

//split up arrays
function splitArrays(arr, arrXtra, rad, width) {

    var C = (Math.PI) * (rad * 2);
    var divSize = width;
    var amountFit = C / divSize;

    if (amountFit < arr.length) {
        var start = Math.round(amountFit / 2);
        for (var i = start; i < arr.length; i++) {
            var elem = arr[i];
            arr.splice(i, 1);
            arrXtra.push(elem);

        }
    }
}

function getSpans() {
    posElem = document.getElementsByClassName('pos');
    for (var i = 0; i < posElem.length; i++) {
        posElem[i].addEventListener("click", function () {
            getNewUserData(this.id, ShowData);
        }, false);
    }
}

function getSound() {
    posElem = document.getElementsByClassName('pos');
    for (var i = 0; i < posElem.length; i++) {

        (function (i) {
            SC.get('/users/' + newData[i].id + '/tracks', {limit: 1}).then(function (tracks) {
                var stream;

                var track = tracks[0].id;
                newData[i].track = tracks[0].id;
                var close = document.getElementById("close");

                posElem[i].addEventListener("click", function (event) {

                    $("#artist-box").css({
                        display: "block",
                        position: "absolute",
                        top: event.pageY - 80,
                        left: event.pageX - 100
                    });
                    document.getElementById("artist-name").innerHTML = newData[i].username;
                    $("#artist-artwork").css({background: "url(" + newData[i].avatar_url + ")"});
                    SC.stream('/tracks/' + track).then(function (player) {
                        stream = player;
                        stream.play();
                        document.getElementById("track-title").innerHTML = tracks[0].title;
                        document.getElementById('close').onclick = function () {
                            document.getElementById('artist-box').style.display = "none";
                        };
                    });
                });
                /**
                 SC.stream('/tracks/' + track).then(function (player) {
                            document.getElementById("img" + i).src= "http://cdn3.iconfinder.com/data/icons/buttons/512/Icon_4-512.png";
                            stream = player;
                            stream.play();
document.getElementById("img" + i).src = "http://www.freeiconspng.com/uploads/play-button-icon-png-0.png";
**/
            });
        })(i);

    }
}

function checkOverlap(area) {
    for (var i = 0; i < positions.length; i++) {

        var checkArea = positions[i];
        var radius;
        var bottom1 = area.y + area.height;
        var bottom2 = checkArea.y + checkArea.height;
        var top1 = area.y;
        var top2 = checkArea.y;
        var left1 = area.x;
        var left2 = checkArea.x;
        var right1 = area.x + area.width;
        var right2 = checkArea.x + checkArea.width;
        if (bottom1 < top2 || top1 > bottom2 || right1 < left2 || left1 > right2) {
            continue;
        }
        return true;
    }
    return false;
}

function positionElements() {
    var posDiv = document.getElementsByClassName("pos");

    for (var p = 0; p < posDiv.length; p++) {

        var min_x = 0;
        var max_x = 110;
        var min_y = 0;
        var max_y = 110;
        var randomX = 0;
        var randomY = 0;
        var area;

        do {
            randomX = Math.round(min_x + ((max_x - min_x) * (Math.random() % 1)) * 20);
            randomY = Math.round(min_y + ((max_y - min_y) * (Math.random() % 1)) * 11);
            area = {x: randomX, y: randomY, width: 110, height: 110};
        } while (checkOverlap(area));

        positions.push(area);

        posDiv[p].style.top = randomY + "px";
        posDiv[p].style.left = randomX + "px";
    }
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
function posE(arr, rad, toggle, pwidth) {

    var svg = document.getElementsByTagName('svg'), width = svg.offsetWidth,
        height = svg.offsetHeight, angle = 0;
    var step = (2 * Math.PI) / arr.length;
    var divSize = pwidth;

    for (var i = 0; i < arr.length; i++) {

        var area;
        console.log(divSize);
        var radius;

        do {
            radius = (radius == rad ? toggle : rad);

            var posx = Math.round(width / 2 + radius * Math.cos(angle) - divSize / 2);
            var posy = Math.round(height / 2 + radius * Math.sin(angle) - divSize / 2);

            area = {x: posx, y: posy, width: divSize, height: divSize};

        } while (checkOverlap(area));

        console.log(rad);

        positions.push(area);

        arr[i].style.left = posx + "px";
        arr[i].style.top = posy + "px";

        angle += step;
    }
}
