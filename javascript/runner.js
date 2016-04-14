// the player-controlled character

var Util = require('./util');
var Physics = require('./physics');
var gameConstants = require('./gameConstants');

var Runner = function (startingPos) {
  this.objType = 'runner';
  this.state = '';
  this.pos = startingPos;
  this.vel = [0, 0];
  this.height = 30;
  this.width = 12;
};

Runner.prototype.draw = function (ctx) {
  console.log(this.state);
  var sprite;
  if (this.state === 'stand') {
    sprite = window.document.getElementById('stand');
  } else if (this.state === 'run-right') {
    sprite = window.document.getElementById('run-right1');
  } else if (this.state === 'run-left') {
    sprite = window.document.getElementById('run-left1');
  } else {
    // default to stand
    sprite = window.document.getElementById('stand');
  }
  ctx.drawImage(
    sprite, this.pos[0], this.pos[1], this.width, this.height
  );
};

Runner.prototype.move = function () {
  // make the movement for this frame based on last frame's
  // velocity
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
  if (this.state === 'stand' && this.vel[0] > 0) {
    this.state = 'run-right';
  } else if (this.state === 'stand' && this.vel[0] < 0) {
    this.state = 'run-left';
  }
  // console.log(this.state);
};

Runner.prototype.handleContact = function (contact) {
  // handles contact detail object passed from Physics
  if (contact.contactType === 'stand') {
    this.standOnPlatform();
    this.state = 'stand';
  }
  if (contact.contactType === 'collision') {
    this.collideWithPlatform(contact.stopPos);
    if (contact.fromDirection === 'above') {
      this.state = 'land';
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
