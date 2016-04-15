// the player-controlled character

var Util = require('./util');
var Physics = require('./physics');
var gameConstants = require('./gameConstants');

var Runner = function (startingPos) {
  this.objType = 'runner';
  this.spriteFrame = 1;
  this.spriteState = 'stand-right';
  this.lastSpriteState = 'stand-right';
  this.lastContactType = '';
  this.pos = startingPos;
  this.vel = [0, 0];
  this.height = 50;
  this.width = 20;
  this.spriteFrameCount = {
    'stand-right': 1,
    'stand-left': 1,
    'run-right': 6,
    'run-left': 6
  };
  this.spriteElements = {};
  this.loadSpriteAssets();
};

Runner.prototype.loadSpriteAssets = function () {
  this.spriteElements['stand-right1'] =
    window.document.getElementById('stand-right1')
  this.spriteElements['stand-left1'] =
    window.document.getElementById('stand-left1')
  this.spriteElements['run-right1'] =
    window.document.getElementById('run-right1')
  this.spriteElements['run-right2'] =
    window.document.getElementById('run-right2')
  this.spriteElements['run-right3'] =
    window.document.getElementById('run-right3')
  this.spriteElements['run-right4'] =
    window.document.getElementById('run-right4')
  this.spriteElements['run-right5'] =
    window.document.getElementById('run-right5')
  this.spriteElements['run-right6'] =
    window.document.getElementById('run-right6')
  this.spriteElements['run-left1'] =
    window.document.getElementById('run-left1')
  this.spriteElements['run-left2'] =
    window.document.getElementById('run-left2')
  this.spriteElements['run-left3'] =
    window.document.getElementById('run-left3')
  this.spriteElements['run-left4'] =
    window.document.getElementById('run-left4')
  this.spriteElements['run-left5'] =
    window.document.getElementById('run-left5')
  this.spriteElements['run-left6'] =
    window.document.getElementById('run-left6')
};

Runner.prototype.draw = function (ctx) {
  // console.log(this.state);
  // var sprite;
  // if (this.spriteState === 'stand-right') {
  //   sprite = window.document.getElementById('stand-right');
  // } else if (this.spriteState === 'run-right') {
  //   sprite = window.document.getElementById('run-right1');
  // } else if (this.spriteState === 'run-left') {
  //   sprite = window.document.getElementById('run-left1');
  // } else {
  //   // default to stand
  //   sprite = window.document.getElementById('stand-right');
  // }
  var id = this.spriteState + (Math.floor(this.spriteFrame /
    gameConstants.framesPerSprite) + 1);
  var sprite = this.spriteElements[id];
  console.log(id);
  ctx.drawImage(
    sprite, this.pos[0], this.pos[1], this.width, this.height
  );
};

Runner.prototype.move = function () {
  // make the movement for this frame based on last frame's
  // velocity
  // console.log(this.vel);
  this.pos = Util.vectorSum(this.pos, this.vel);
  // then add the constant velocity components for the next frame
  this.vel = Physics.addGravity(this.vel);
  this.vel = Physics.addFriction(this.vel);
  // and determine the state to be in for next frame
  this.determineState();
};

Runner.prototype.determineState = function () {
  // 'stand' or 'collide' at this point may have been previously
  // set by handleContact

  // if (this.state === 'stand' && this.vel[0] > 0) {
  //   this.state = 'run-right';
  // } else if (this.state === 'stand' && this.vel[0] < 0) {
  //   this.state = 'run-left';
  // }
  var newState;
  if (this.vel[0] > 0) {
    newState = 'run-right';
  } else if (this.vel[0] < 0) {
    newState = 'run-left';
  } else if (this.vel[0] === 0 &&
    (this.lastSpriteState === 'run-right' ||
    this.lastSpriteState === 'stand-right')) {
    newState = 'stand-right';
  } else if (this.vel[0] === 0 &&
    (this.lastSpriteState = 'run-left' ||
    this.lastSpriteState === 'stand-left')) {
    newState = 'stand-left';
  } else {
    newState = 'stand-right';
  }
  if (newState === this.lastSpriteState) {
    if (this.spriteFrame + 1 < this.spriteFrameCount[newState] *
      gameConstants.framesPerSprite) {
      this.spriteFrame = this.spriteFrame + 1;
    } else {
      this.spriteFrame = 1;
    }
  } else {
    this.spriteFrame = 1;
  }
  this.lastSpriteState = this.spriteState;
  this.spriteState = newState;
  // console.log(this.state);
};

Runner.prototype.handleContact = function (contact) {
  // handles contact detail object passed from Physics
  if (contact.contactType === 'stand') {
    this.standOnPlatform();
    this.lastContactType = 'stand';
  }
  if (contact.contactType === 'collision') {
    this.collideWithPlatform(contact.stopPos);
    if (contact.fromDirection === 'above') {
      this.lastContactType = 'collision';
    }
  }
};

Runner.prototype.standOnPlatform = function () {
  this.vel = Physics.addNormalForce(this.vel);
};

Runner.prototype.collideWithPlatform = function (stopPos) {
  // fully stop (not realistic, but feels less slippery)
  this.vel = [0, 0];
  this.pos = stopPos;
};

Runner.prototype.runAccelerate = function (dir) {
  var sign;
  if (dir === 'left') {
    sign = -1;
  } else if (dir === 'right') {
    sign = 1;
  }
  // first ensure running is always equal to friction, to allow
  // maintaining velocity
  var runAccel = [sign * gameConstants.friction, 0];
  // if velocity is less than max run velocity, add extra
  // term beyond overcoming friction to allow acceleration
  if ((dir === 'left' && this.vel[0] >= -(gameConstants.maxRunVel)) ||
    (dir === 'right' && this.vel[0] <= gameConstants.maxRunVel)) {
    // if adding the full extra acceleration would put the runner
    // past max speed, only add the difference
    var speedDelta = gameConstants.maxRunVel - Math.abs(this.vel[0]);
    var accel = Math.min(speedDelta, gameConstants.runAccel);
    var extraAccel = [sign * accel, 0];
    runAccel = Util.vectorSum(runAccel, extraAccel);
  }
  this.vel = Util.vectorSum(this.vel, runAccel);
};

Runner.prototype.jump = function () {
  // jumpAccel = [0, -(gameConstants.jumpAccel)];
  // this.vel = Util.vectorSum(this.vel, jumpAccel);
  this.vel = [this.vel[0], -(gameConstants.jumpAccel)];
};

module.exports = Runner;
