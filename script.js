var runsound = new Audio("run.mp3");
var jumpsound = new Audio("jump.mp3");
var deadsound = new Audio("dead.mp3");


//Owner Credit for Pavindu Dulshan Bhashitha

function key(event) {
    //alert(event.which);

    if (startif == 0) {

        //Entercode
        if (event.which == 13) {
            if (runWorker == 0) {
                runWorker = setInterval(run, 100);
                runsound.play();
                backgroundWorker = setInterval(background, 100);
                scoreWorker = setInterval(score, 100);
                boxId = box();
                boxWorker = setInterval(movebox, 100);
                if (bmt < 485) {
                    document.getElementById("boy").style.marginTop = "485px";
                }
                arrowId = arrows();
                movearrowWorker = setInterval(movearrows, 100);
            }
        }

        //space
        if (event.which == 32) {
            if (jumpWorker == 0) {
                clearInterval(runWorker);
                runsound.pause();
                jumpWorker = setInterval(jump, 100);
                jumpsound.play();
                if (bmt < 54) {
                    document.getElementById("boy").style.marginTop = "54vh";
                }

            }

        }
        //shift
        if (event.which == 16) {
            if(deadImage < 1){
            pauseWorker = pause();
             }
        }

        //ctrl
        if (event.which == 17) {
            if (deadImage < 1) {
                slideWorker = setInterval(slide, 200);
            }
        }
    }
}

var runWorker = 0;
var runImage = 1;
var x = 300;
var backgroundWorker = 0;
var jumpImage = 1;
var jumpWorker = 0;
var slideImage = 1;
var slideWorker = 0;
var s = 0;
var scoreWorker = 0;
var bml = 800;
var boxId = 0;
var boxWorker = 0;
var deadImage = 0;
var pauseWorker = 0;
var startif = 1;
var aml = 1200;
var movearrowWorker = 0;
var bmt = 54;
var slideif = 1;
var arrowId = 0;

function run() {
    runImage = runImage + 1;
    if (runImage == 9) {
        runImage = 1;
    }
    document.getElementById("boy").src = "1/Run (" + runImage + ").png"
}

function background() {
    x = x - 20;

    document.getElementById("background").style.backgroundPositionX = x + "px";
    
}


function jump() {

    if (jumpImage <= 5) {
        bmt = bmt - 3;
        document.getElementById("boy").style.marginTop = bmt + "vh";
    }
    if (jumpImage >= 6) {
        bmt = bmt + 3;
        document.getElementById("boy").style.marginTop = bmt + "vh";
    }



    clearInterval(slide);
    jumpImage = jumpImage + 1;
    if (jumpImage == 11) {
        jumpImage = 1;

        clearInterval(jumpWorker);
        runWorker = setInterval(run, 100);
        runsound.play();
        jumpWorker = 0;

        if (backgroundWorker == 0) {
            backgroundWorker = setInterval(background, 100);

        }
        if (scoreWorker == 0) {
            scoreWorker = setInterval(score, 100);
        }
        if (boxId == 0) {
            boxId = box();
        }
        if (boxWorker == 0) {
            boxWorker = setInterval(movebox, 100);
        }
        if (arrowId == 0) {
            arrowId = arrows();
        }
        if (movearrowWorker == 0) {
            movearrowWorker = setInterval(movearrows, 100);
        }


    }
    document.getElementById("boy").src = "1/Jump (" + jumpImage + ").png"

}
function slide() {
    slideif = 0;
    jumpsound.play();
    clearInterval(runWorker);
    if (deadImage > 0) {
        clearInterval(slideWorker);
    }


    document.getElementById("boy").src = "1/Slide (" + slideImage + ").png";
    slideImage = slideImage + 1;


    if (slideImage == 6) {

        slideImage = 1;
        clearInterval(slideWorker);
        runWorker = setInterval(run, 100);

        if (movearrowWorker == 1) {
            clearInterval(run);
        }

        slideif = 1;


        if (backgroundWorker == 0) {
            backgroundWorker = setInterval(background, 100);

        }
        if (scoreWorker == 0) {
            scoreWorker = setInterval(score, 100);
        }
        if (boxId == 0) {
            boxId = box();
        }
        if (boxWorker == 0) {
            boxWorker = setInterval(movebox, 100);
        }
        if (arrowId == 0) {
            arrowId = arrows();
        }
        if (movearrowWorker == 0) {
            movearrowWorker = setInterval(movearrows, 100);
        }

    }



}
function score() {

    s = s + 10;
    document.getElementById("score").innerHTML = s;
}
function box() {
    for (var a = 0; a < 100; a++) {

        var box = document.createElement("div");
        box.className = "box";
        box.id = "d" + a;

        if (a <= 30 & a >= 2) {

            bml = bml + 1000;
        }

        if (a >= 31 & a <= 60) {

            bml = bml + 800;
        }

        if (a >= 61 & a <= 100) {


            bml = bml + 600;
        }
        box.style.marginLeft = bml + "px";

        document.getElementById("background").appendChild(box);

    }
}
function arrows() {
    for (var a = 0; a < 100; a++) {

        var arrow = document.createElement("div");
        arrow.className = "arrow";
        arrow.id = "c" + a;

        if (a <= 30 & a >= 2) {

            aml = aml + 1000;
        }

        if (a >= 31 & a <= 60) {

            aml = aml + 800;
        }

        if (a >= 61 & a <= 100) {


            aml = aml + 600;
        }
        arrow.style.marginLeft = aml + "px";

        document.getElementById("background").appendChild(arrow);

    }
  
}
function movearrows() {
    for (a = 0; a < 100; a++) {

        var y = getComputedStyle(document.getElementById("c" + a));

        var q = parseInt(y.marginLeft);

        q = q - 25;

        document.getElementById("c" + a).style.marginLeft = q + "px";
        //alert(q);

        // 160 - 95
        if (q >= 60 & q <= 185) {
            if (slideif == 1) {
                clearInterval(runWorker);
                runWorker = -1;
                runsound.pause();
                clearInterval(backgroundWorker);

                clearInterval(boxId);

                clearInterval(scoreWorker);

                clearInterval(boxWorker);
                jumpsound.pause();
                setInterval(dead, 100);
                deadsound.play();
                clearInterval(slideWorker);
                clearInterval(jumpWorker);
                jumpWorker = -1;
                clearInterval(movearrowWorker);
                movearrowWorker = 1;

            }


        }

    }

}
function end(){
    document.getElementById("end-box").style.visibility = "visible";
    document.getElementById("background").style.visibility = "hidden";
}
function movebox() {

    for (a = 0; a < 100; a++) {

        var z = getComputedStyle(document.getElementById("d" + a));

        var p = parseInt(z.marginLeft);

        p = p - 25;

        document.getElementById("d" + a).style.marginLeft = p + "px";
        //alert(p);

        // 160 - 95

        if (p >= 40 & p <= 168) {
            if (bmt == 54) {
                clearInterval(runWorker);
                runWorker = -1;
                runsound.pause();
                clearInterval(backgroundWorker);

                clearInterval(boxId);

                clearInterval(scoreWorker);

                clearInterval(boxWorker);

                clearInterval(jumpWorker);
                jumpWorker = -1;
                jumpsound.pause();
                setInterval(dead, 100);
                deadsound.play();
                clearInterval(movearrowWorker);
                movearrowWorker = 1;
            }


        }
    }

}
function dead() {

    deadImage = deadImage + 1;
    document.getElementById("boy").style.marginTop = "54vh";
    if (deadImage == 11) {
        deadImage = 10;

    }
    document.getElementById("boy").src = "1/Dead (" + deadImage + ").png";
    document.getElementById("end").style.visibility = "visible";
    document.getElementById("endscore").innerHTML = s;

}
function pause() {
    clearInterval(runWorker);
    runWorker = 0;
    clearInterval(backgroundWorker);
    backgroundWorker = 0;
    clearInterval(boxWorker);
    boxWorker = 0;
    clearInterval(scoreWorker);
    scoreWorker = 0;
    clearInterval(jumpWorker);
    jumpWorker = 0;
    runsound.pause();
    clearInterval(slideWorker);
    slideWorker = 0;
    clearInterval(movearrowWorker);
    movearrowWorker = 0;
}
function reload() {
    location.reload();
}
function start() {
    document.getElementById("background").style.visibility = "visible";
    document.getElementById("score").style.visibility = "visible";
    document.getElementById('home').style.visibility = "hidden";
    startif = 0;
}
function toplay(){
    document.getElementById('home').style.visibility = "invisible";
    document.getElementById('start').style.visibility = "visible";
}