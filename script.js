var runsound = new Audio("run.mp3");
var jumpsound = new Audio("jump.mp3");
var deadsound = new Audio("dead.mp3");

// Owner Credit for Pavindu Dulshan Bhashitha

var runWorker = 0;
var runImage = 1;
var x = 0;
var backgroundWorker = 0;
var jumpImage = 1;
var jumpWorker = 0;
var slideImage = 1;
var slideWorker = 0;
var s = 0;
var scoreWorker = 0;
var deadImage = 0;
var deadWorker = 0;
var pauseWorker = 0;
var startif = 1;
var bmt = 54;
var slideif = 1;
var obstacleWorker = 0;

// Obstacle pool for efficient DOM recreation
var obstacles = [];

function key(event) {
    if (startif == 0) {
        var keyCode = event.which || event.keyCode;

        // ENTER: Run
        if (keyCode == 13) {
            if (runWorker == 0 && deadImage == 0) {
                runWorker = setInterval(run, 100);
                runsound.play().catch(function() {});

                if (backgroundWorker == 0) {
                    backgroundWorker = setInterval(background, 100);
                }
                if (scoreWorker == 0) {
                    scoreWorker = setInterval(score, 100);
                }

                document.getElementById("boy").style.marginTop = "54vh";
                bmt = 54;

                if (obstacles.length == 0) {
                    initObstacles();
                }
                if (obstacleWorker == 0) {
                    obstacleWorker = setInterval(moveObstacles, 100);
                }
            }
        }

        // SPACE: Jump
        if (keyCode == 32) {
            if (jumpWorker == 0 && deadImage == 0) {
                clearInterval(runWorker);
                runWorker = 0;
                runsound.pause();
                jumpWorker = setInterval(jump, 100);
                jumpsound.currentTime = 0;
                jumpsound.play().catch(function() {});
            }
        }

        // SHIFT: Pause
        if (keyCode == 16) {
            if (deadImage < 1) {
                pause();
            }
        }

        // CTRL: Slide
        if (keyCode == 17) {
            if (deadImage < 1 && slideWorker == 0 && jumpWorker == 0) {
                clearInterval(runWorker);
                runWorker = 0;
                slideWorker = setInterval(slide, 100);
            }
        }
    }
}

function run() {
    runImage = runImage + 1;
    if (runImage == 9) {
        runImage = 1;
    }
    document.getElementById("boy").src = "1/Run (" + runImage + ").png";
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

    jumpImage = jumpImage + 1;
    if (jumpImage == 11) {
        jumpImage = 1;
        clearInterval(jumpWorker);
        jumpWorker = 0;
        bmt = 54;
        document.getElementById("boy").style.marginTop = "54vh";

        if (deadImage == 0) {
            runWorker = setInterval(run, 100);
            runsound.play().catch(function() {});

            if (backgroundWorker == 0) {
                backgroundWorker = setInterval(background, 100);
            }
            if (scoreWorker == 0) {
                scoreWorker = setInterval(score, 100);
            }
            if (obstacleWorker == 0) {
                obstacleWorker = setInterval(moveObstacles, 100);
            }
        }
    }
    document.getElementById("boy").src = "1/Jump (" + jumpImage + ").png";
}

function slide() {
    slideif = 0;
    jumpsound.currentTime = 0;
    jumpsound.play().catch(function() {});

    if (deadImage > 0) {
        clearInterval(slideWorker);
        slideWorker = 0;
        return;
    }

    document.getElementById("boy").src = "1/Slide (" + slideImage + ").png";
    slideImage = slideImage + 1;

    if (slideImage == 6) {
        slideImage = 1;
        clearInterval(slideWorker);
        slideWorker = 0;
        slideif = 1;

        if (deadImage == 0) {
            runWorker = setInterval(run, 100);
            runsound.play().catch(function() {});

            if (backgroundWorker == 0) {
                backgroundWorker = setInterval(background, 100);
            }
            if (scoreWorker == 0) {
                scoreWorker = setInterval(score, 100);
            }
            if (obstacleWorker == 0) {
                obstacleWorker = setInterval(moveObstacles, 100);
            }
        }
    }
}

function score() {
    s = s + 10;
    document.getElementById("score").innerHTML = s;
}

// Efficient obstacle initialization in memory
function initObstacles() {
    obstacles = [];
    var container = document.getElementById("obstacles-container");
    if (container) {
        container.innerHTML = "";
    }

    var bml = 800;
    var aml = 1300;

    for (var a = 0; a < 100; a++) {
        if (a > 0 && a <= 30) {
            bml += 1000;
            aml += 1000;
        } else if (a >= 31 && a <= 60) {
            bml += 800;
            aml += 800;
        } else if (a >= 61) {
            bml += 600;
            aml += 600;
        }

        obstacles.push({
            id: "d" + a,
            type: "box",
            x: bml,
            element: null,
            passed: false,
            dodged: false
        });

        obstacles.push({
            id: "c" + a,
            type: "arrow",
            x: aml,
            element: null,
            passed: false,
            dodged: false
        });
    }
}

// Efficient obstacle update: creates DOM divs on demand and removes offscreen divs
function moveObstacles() {
    var container = document.getElementById("obstacles-container") || document.getElementById("background");
    var viewWidth = window.innerWidth || 1920;

    // Dynamically calculate accurate character collision bounds based on actual DOM position
    var boyEl = document.getElementById("boy");
    var boyLeft = boyEl ? boyEl.offsetLeft : 60;
    // Character body spans roughly offset +55px to +205px within the 280px sprite
    var hitMaxX = boyLeft + 175; // ~235px (front contact: moment flame touches character)
    var hitMinX = boyLeft + 20;  // ~80px (rear exit: moment flame completely passes character)

    for (var i = 0; i < obstacles.length; i++) {
        var obs = obstacles[i];
        if (obs.passed) continue;

        obs.x -= 25;

        // Check if inside or approaching the active visible area
        if (obs.x < viewWidth + 150 && obs.x > -100) {
            if (!obs.element) {
                var el = document.createElement("div");
                el.className = obs.type;
                el.id = obs.id;
                el.style.transition = "left 0.1s linear";   
                el.style.left = obs.x + "px";
                container.appendChild(el);
                obs.element = el;
            } else {
                obs.element.style.left = obs.x + "px";
            }

            // Ground box collision check
            if (obs.type === "box") {
                if (obs.x >= hitMinX && obs.x <= hitMaxX) {
                    if (bmt < 54) {
                        // Player is jumping in the air: successfully cleared the flame!
                        obs.dodged = true;
                    } else if (!obs.dodged) {
                        // Player is on the ground: instant direct impact at front contact!
                        triggerDead();
                        return;
                    }
                }
            }

            // Aerial arrow collision check
            if (obs.type === "arrow") {
                if (obs.x >= hitMinX && obs.x <= hitMaxX) {
                    if (slideif === 0) {
                        // Player is sliding: successfully ducked under!
                        obs.dodged = true;
                    } else if (!obs.dodged) {
                        // Player is standing upright: instant direct impact at front contact!
                        triggerDead();
                        return;
                    }
                }
            }
        } else if (obs.x <= -100) {
            // Reached left of screen: remove div from DOM to free resources
            if (obs.element) {
                obs.element.remove();
                obs.element = null;
            }
            obs.passed = true;
        }
    }

    // Check victory condition: all obstacles cleared
    if (obstacles.length > 0 && obstacles.every(function(o) { return o.passed; })) {
        end();
    }
}

function triggerDead() {
    clearInterval(runWorker);
    runWorker = -1;
    runsound.pause();
    clearInterval(backgroundWorker);
    backgroundWorker = 0;
    clearInterval(scoreWorker);
    scoreWorker = 0;
    clearInterval(obstacleWorker);
    obstacleWorker = 0;
    clearInterval(jumpWorker);
    jumpWorker = -1;
    clearInterval(slideWorker);
    slideWorker = 0;
    jumpsound.pause();

    deadsound.currentTime = 0;
    deadsound.play().catch(function() {});
    deadWorker = setInterval(dead, 100);
}

function dead() {
    deadImage = deadImage + 1;
    document.getElementById("boy").style.marginTop = "54vh";
    if (deadImage >= 10) {
        deadImage = 10;
        clearInterval(deadWorker);
    }
    document.getElementById("boy").src = "1/Dead (" + deadImage + ").png";

    var endEl = document.getElementById("end");
    endEl.style.visibility = "visible";
    endEl.style.display = "flex";
    document.getElementById("endscore").innerHTML = s;
}

function pause() {
    clearInterval(runWorker);
    runWorker = 0;
    clearInterval(backgroundWorker);
    backgroundWorker = 0;
    clearInterval(obstacleWorker);
    obstacleWorker = 0;
    clearInterval(scoreWorker);
    scoreWorker = 0;
    clearInterval(jumpWorker);
    jumpWorker = 0;
    clearInterval(slideWorker);
    slideWorker = 0;
    runsound.pause();
}

function end() {
    pause();
    var winEl = document.getElementById("end-box");
    winEl.style.visibility = "visible";
    winEl.style.display = "flex";
}

function reload() {
    location.reload();
}

function start() {
    x = 0;
    var bg = document.getElementById("background");
    bg.style.backgroundPositionX = "0px";
    bg.style.display = "block";
    var scoreEl = document.getElementById("score");
    scoreEl.style.display = "block";
    scoreEl.style.visibility = "visible";
    document.getElementById("home-page").style.display = "none";
    document.getElementById("start").style.display = "none";
    closeabout();
    startif = 0;

    initObstacles();
}

function toplay() {
    document.getElementById("home-page").style.display = "none";
    document.getElementById("start").style.display = "flex";
    closeabout();
}

function tohome() {
    document.getElementById("start").style.display = "none";
    closeabout();
    document.getElementById("home-page").style.display = "flex";
}

function toabout() {
    var modal = document.getElementById("about-modal");
    if (modal) modal.style.display = "flex";
}

function closeabout() {
    var modal = document.getElementById("about-modal");
    if (modal) modal.style.display = "none";
}

function man() {
    var char = document.getElementById("char01");
    if (!char) return;
    char.style.transform = "scale(1.2) translateY(-10px)";
    setTimeout(function() {
        char.style.transform = "scale(1) translateY(0)";
    }, 200);
}

// Backwards compatibility wrappers
function box() { return 0; }
function arrows() { return 0; }
function movebox() {}
function movearrows() {}
