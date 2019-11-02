let video;
let poseNet;
let leftShoulderX = 0;
let leftShoulderY = 0;
let leftHipX = 0;
let leftHipY = 0;
let rightShoulderX = 0;
let rightShoulderY = 0;
let rightWristX = 0;
let rightWristY = 0;
let rightHipX = 0;
let rightHipY = 0;
var isLeft = false;
var isRight = false;
let counter = 0;
var Colors = {
  yellow: 0xffff00,
  meteor: 0x61616c,
  red: 0xff0000,
  pink: 0xff6ec7,
  navyblue: 0x133e7c,
  neonpink: 0xea02d9,
  neonpurple: 0x711d91
};

function setup() {
  var canvas = createCanvas(320, 240);
  canvas.parent("sketch-div");
  video = createCapture(VIDEO);
  video.hide();
  poseNet = ml5.poseNet(video, modelReady);
  poseNet.on("pose", gotPoses);
}

function gotPoses(poses) {
  if (poses.length > 0) {
    let lsX = poses[0].pose.keypoints[5].position.x;
    let lsY = poses[0].pose.keypoints[5].position.y;
    let lhX = poses[0].pose.keypoints[11].position.x;
    let lhY = poses[0].pose.keypoints[11].position.y;
    let rsX = poses[0].pose.keypoints[6].position.x;
    let rsY = poses[0].pose.keypoints[6].position.y;
    let rhX = poses[0].pose.keypoints[12].position.x;
    let rhY = poses[0].pose.keypoints[12].position.y;
    let rwX = poses[0].pose.keypoints[10].position.x;
    let rwY = poses[0].pose.keypoints[10].position.y;
    leftShoulderX = lerp(leftShoulderX, lsX, 0.4);
    leftShoulderY = lerp(leftShoulderY, lsY, 0.4);
    leftHipX = lerp(leftHipX, lhX, 0.4);
    leftHipY = lerp(leftHipY, lhY, 0.4);
    rightShoulderX = lerp(rightShoulderX, rsX, 0.4);
    rightShoulderY = lerp(rightShoulderY, rsY, 0.4);
    rightHipX = lerp(rightHipX, rhX, 0.5);
    rightHipY = lerp(rightHipY, rhY, 0.5);
    rightHipX = lerp(rightHipX, rhX, 0.5);
    rightHipY = lerp(rightHipY, rhY, 0.5);
    rightWristX = lerp(rightWristX, rwX, 0.5);
    rightWristY = lerp(rightWristY, rwY, 0.5);
  }
}

function modelReady() {
  console.log("model ready");
}

function draw() {
  // rightShoulderX = map(rightShoulderX, 0, 640, 0, 320);
  // rightShoulderY = map(rightShoulderY, 0, 480, 0, 240);
  background(255);
  push();
  scale(0.5);
  // fill(255, 20, 147, 100);
  image(video, 0, 0);
  ellipse(rightShoulderX, rightShoulderY, 30);
  ellipse(leftShoulderX, leftShoulderY, 30);
  pop();
  strokeWeight(6);
  stroke(255, 20, 147);
  rectMode(CENTER);
  line(0, 70, 320, 70);
  fill(255, 20, 147, 100);
  noStroke();
  // rect(107, 100, 60, 40);
  // rect(214, 100, 60, 40);
  rect(0, 90, 640, 30);

  if (rightShoulderX > rightHipX) {
    isLeft = false;
    isRight = true;
  } else if (leftShoulderX < leftHipX) {
    isLeft = true;
    isRight = false;
  } else {
    isRight = false;
    isLeft = false;
  }
}

var deg2Rad = Math.PI / 180;

// Make a new world when the page is loaded.
window.addEventListener("load", function() {
  new World();
});

var paused, player;
function World() {
  // Explicit binding of this even in changing contexts.
  var self = this;

  // Scoped variables in this world.
  var element,
    scene,
    camera,
    renderer,
    sound,
    light,
    objects,
    keysAllowed,
    score,
    ringPresenceProb,
    maxRingSize,
    fogDistance,
    gameOver,
    gridHelper,
    redRingPresenceProb;

  // Initialize the world.
  init();

  function init() {
    sceneWidth = window.innerWidth;
    sceneHeight = window.innerHeight;
    element = document.getElementById("world");

    objects = [];
    ringPresenceProb = 0.16;
    redRingPresenceProb = 0.32;
    maxRingSize = 0.9;

    gameOver = false;
    paused = true;

    renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true
    });
    renderer.setSize(element.clientWidth, element.clientHeight);
    renderer.shadowMap.enabled = true;
    element.appendChild(renderer.domElement);

    scene = new THREE.Scene();
    fogDistance = 30000;
    scene.fog = new THREE.Fog(0xbadbe4, 1, fogDistance);

    camera = new THREE.PerspectiveCamera(
      60,
      element.clientWidth / element.clientHeight,
      1,
      120000
    );
    camera.position.set(0, 1000, -2200);
    window.camera = camera;

    window.addEventListener("resize", updatedWindowSize, false);
    light = new THREE.HemisphereLight(0xffffff, 0xffffff, 1);
    scene.add(light);

    player = new Player();
    scene.add(player.element);

    var listener = new THREE.AudioListener();
    camera.add(listener);

    sound = new THREE.Audio(listener);
    bgmusic = new THREE.Audio(listener);

    var audioLoader = new THREE.AudioLoader();
    audioLoader.load("mariocoin.wav", function(buffer) {
      sound.setBuffer(buffer);
      sound.setVolume(1);
    });
    audioLoader.load("vaporwavemusic.mp3", function(buffer) {
      bgmusic.setBuffer(buffer);
      bgmusic.setLoop(true);
      bgmusic.setVolume(0.5);
      bgmusic.play();
    });

    gridHelper = new THREE.GridHelper(50000, 80);
    gridHelper.castShadow = true;
    gridHelper.position.set(-300, -400, -2000);
    scene.add(gridHelper);

    sun = new THREE.DirectionalLight(0xcdc1c5, 0.9);
    sun.position.set(5, 0, 15);
    sun.castShadow = true;
    scene.add(sun);

    var left = 37;
    var up = 38;
    var right = 39;
    var p = 80;

    keysAllowed = {};
    document.addEventListener("keydown", function(e) {
      if (!gameOver) {
        var key = e.keyCode;
        if (keysAllowed[key] === false) return;
        keysAllowed[key] = false;
        if (paused && !isHit() && key > 18) {
          paused = false;
          player.onUnpause();
        } else {
          if (key == p) {
            paused = true;
            player.onPause();
          }
          if (key == up && !paused) {
            player.onUpKeyPressed();
          }
          if (key == left && !paused) {
            player.onLeftKeyPressed();
          }
          if (key == right && !paused) {
            player.onRightKeyPressed();
          }
        }
      }
    });
    document.addEventListener("keyup", function(e) {
      keysAllowed[e.keyCode] = true;
    });
    document.addEventListener("focus", function(e) {
      keysAllowed = {};
    });

    score = 0;
    difficulty = 0;
    document.getElementById("score").innerHTML = score;
    loop();
  }

  function loop() {
    if (!paused) {
      counter += 1;

      if (counter % 70 == 0) {
        createRowOfRings(-20000, ringPresenceProb, 0.8, maxRingSize);
        scene.fog.far = fogDistance;
      }

      gridHelper.position.z += 100;
      if (gridHelper.position.z >= 1000) {
        gridHelper.position.z = -10;
      }
      objects.forEach(function(object) {
        object.mesh.position.z += 100;
      });

      objects = objects.filter(function(object) {
        return object.mesh.position.z < 0;
      });

      player.update();

      if (isHit() == "red") {
        gameOver = true;
        paused = true;
        document.addEventListener("keydown", function(e) {
          if (e.keyCode == 40) document.location.reload(true);
        });
      }

      if (gameOver == true) {
        document.getElementById("gameOverText").style.display = "inline";
        document.getElementById("everything").style.opacity = "0.4";
      }

      if (isHit() == "yellow") {
        score += 300;
        sound.play();
      }
      score += 10;
      document.getElementById("score").innerHTML = score;
    }

    renderer.render(scene, camera);
    requestAnimationFrame(loop);
  }

  function updatedWindowSize() {
    renderer.setSize(element.clientWidth, element.clientHeight);
    camera.aspect = element.clientWidth / element.clientHeight;
    camera.updateProjectionMatrix();
  }

  function createRowOfRings(position, probability, minScale, maxScale) {
    var createAllRed = Math.random();
    if (createAllRed >= 0.95) {
      for (var lane = -2; lane < 3; lane++) {
        var scale = minScale + (maxScale - minScale);
        var type = "red";
        var ring = new Ring(lane * 600, 0, position, scale, Colors.red, type);
        objects.push(ring);
        scene.add(ring.mesh);
      }
    } else {
      for (var lane = -2; lane < 3; lane++) {
        var randomNumber = Math.random(0, 1);
        if (randomNumber < probability) {
          var scale = minScale + (maxScale - minScale);
          console.log(scale);
          var type = "yellow";
          var ring = new Ring(
            lane * 600,
            0,
            position,
            scale,
            Colors.neonpurple,
            type
          );
          objects.push(ring);
          scene.add(ring.mesh);
        } else if (
          randomNumber < redRingPresenceProb &&
          randomNumber > probability
        ) {
          var scale = minScale + (maxScale - minScale);
          var type = "red";
          var ring = new Ring(lane * 600, 0, position, scale, Colors.red, type);
          objects.push(ring);
          scene.add(ring.mesh);
        }
      }
    }
  }

  function isHit() {
    var charMinX = player.element.position.x;
    var charMaxX = player.element.position.x;
    var charMinY = player.element.position.y;
    var charMaxY = player.element.position.y;
    var charMinZ = player.element.position.z;
    var charMaxZ = player.element.position.z;
    for (var i = 0; i < objects.length; i++) {
      if (
        objects[i].collides(
          charMinX,
          charMaxX,
          charMinY,
          charMaxY,
          charMinZ,
          charMaxZ
        )
      ) {
        return objects[i].type;
      }
    }
    return false;
  }
}

function Player() {
  var self = this;
  this.jumpDuration = 0.6;
  this.jumpHeight = 2000;

  init();
  function init() {
    self.element = createSphere(150, 190, 40, Colors.neonpink, 0, 0, -4200);
    self.isJumping = false;
    self.isSwitchingLeft = false;
    self.isSwitchingRight = false;
    self.runningStartTime = new Date() / 1000;
    self.pauseStartTime = new Date() / 1000;
    self.stepFreq = 2;
    self.queuedActions = [];
  }

  this.update = function() {
    var currentTime = new Date() / 1000;
    if (!self.isJumping) {
      if (
        rightShoulderY < 75 ||
        (leftShoulderY < 75 && self.element.position.y == 0)
      ) {
        self.isJumping = true;
        self.jumpStartTime = new Date() / 1000;
      }
      this.onUpKeyPressed = function() {
        self.isJumping = true;
        self.jumpStartTime = new Date() / 1000;
      };
    }

    if (self.isJumping) {
      var jumpClock = currentTime - self.jumpStartTime;
      if (jumpClock < 0.3) {
        self.element.position.y += 120;
      } else if (jumpClock >= 0.3) {
        self.element.position.y -= 120;
      }
      if (jumpClock > self.jumpDuration) {
        self.isJumping = false;
        self.runningStartTime += self.jumpDuration;
      }
    } else {
      var runningClock = currentTime - self.runningStartTime;
      self.element.position.y = 0;
      self.element.rotation.x -= 0.2;

      // if (isLeft == true) {
      //   self.element.position.x += 10;
      // }
      // if (isRight == true) {
      //   self.element.position.x -= 10;
      // }
      this.onLeftKeyPressed = function() {
        self.element.position.x -= 80;
        self.element.rotation.y += 1;
        self.element.rotation.x += 5;
      };
      this.onRightKeyPressed = function() {
        self.element.position.x += 80;
        self.element.rotation.y -= 1;
        self.element.rotation.x += 5;
      };
      this.onPause = function() {
        self.pauseStartTime = new Date() / 1000;
      };
    }
  };

  this.onUnpause = function() {
    var currentTime = new Date() / 1000;
    var pauseDuration = currentTime - self.pauseStartTime;
    self.runningStartTime += pauseDuration;
    if (self.isJumping) {
      self.jumpStartTime += pauseDuration;
    }
  };
}

function Ring(x, y, z, s, assignedColor, typeOfRing) {
  var self = this;
  var ring = new THREE.RingGeometry(320, 290, 30, 23, 0, 6.3);
  var material = new THREE.MeshBasicMaterial({
    color: assignedColor,
    side: THREE.DoubleSide
  });
  this.mesh = new THREE.Mesh(ring, material);
  this.mesh.position.set(x, y, z);
  this.mesh.scale.set(s, s, s);
  this.scale = s;
  this.type = typeOfRing;

  this.collides = function(minX, maxX, minY, maxY, minZ, maxZ) {
    var ringMinX = self.mesh.position.x - this.scale * 400;
    var ringMaxX = self.mesh.position.x + this.scale * 400;
    var ringMinY = self.mesh.position.y;
    var ringMaxY = self.mesh.position.y + this.scale * 700;
    var ringMinZ = self.mesh.position.z - this.scale * 300;
    var ringMaxZ = self.mesh.position.z + this.scale * 400;

    return (
      ringMinX <= maxX &&
      ringMaxX >= minX &&
      ringMinY <= maxY &&
      ringMaxY >= minY &&
      ringMinZ <= maxZ &&
      ringMaxZ >= minZ &&
      typeOfRing
    );
  };
}

function createSphere(dx, dy, dz, color, x, y, z, notFlatShading) {
  var geom = new THREE.SphereGeometry(dx, 8, 6);
  var mat = new THREE.MeshStandardMaterial({
    color: color,
    flatShading: notFlatShading != true
  });
  var sphere = new THREE.Mesh(geom, mat);
  sphere.castShadow = true;
  sphere.receiveShadow = true;
  sphere.position.set(x, y, z);
  return sphere;
}

var revealerCount = 0;

function putAbout() {
  var aboutContainer = document.getElementById("aboutContainer");
  var p5Canvas = document.getElementById("defaultCanvas0");
  var threeCanvas = document.getElementById("defaultCanvas0");
  var everything = document.getElementById("everything");
  var closeContainer = document.getElementsByClassName("fa-times");

  if (revealerCount % 2 == 0) {
    aboutContainer.style.display = "inline";
    everything.style.opacity = 0.3;
    paused = true;
    player.onPause();
  } else if (revealerCount % 2 == 1) {
    aboutContainer.style.display = "none";
    everything.style.opacity = 1;
    paused = false;
    player.onUnpause();
  }
  revealerCount += 1;
}
function removeFirst() {
  var firstInstructions = document.getElementById("introBox");
  firstInstructions.style.display = "none";
  var secondInstructions = document.getElementById("secondIntro");
  secondInstructions.style.display = "inline";
}

function removeSecond() {
  var secondInstructions = document.getElementById("secondIntro");
  var everything = document.getElementById("everything");
  var thirdInstructions = document.getElementById("thirdIntro");

  secondInstructions.style.display = "none";
  thirdInstructions.style.display = "inline";
}

function removeThird() {
  var thirdInstructions = document.getElementById("thirdIntro");
  var everything = document.getElementById("everything");
  var fourthInstructions = document.getElementById("fourthIntro");
  fourthInstructions.style.display = "inline";
  thirdInstructions.style.display = "none";
}
function removeFourth() {
  var fourthInstructions = document.getElementById("fourthIntro");
  var everything = document.getElementById("everything");
  everything.style.opacity = "1";
  fourthInstructions.style.display = "none";
  paused = false;
  player.onUnpause();
}

function endTutorial() {
  var everything = document.getElementById("everything");
  var firstInstructions = document.getElementById("introBox");
  firstInstructions.style.display = "none";
  everything.style.opacity = "1";
  paused = false;
  player.onUnpause();
}
