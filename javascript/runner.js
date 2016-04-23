// the player-controlled character

var Util = require('./util');
var Physics = require('./physics');
var gameConstants = require('./gameConstants');
var RunnerAnimator = require('./runnerAnimator');

var Runner = function (startingPos) {
  this.pos = startingPos;
  this.vel = [0, 0];
  this.frameState = 'stand-right';
  this.prevFrameState = 'stand-right';
  this.lastContactType = 'stand';
  this.jumpsRemaining = gameConstants.numJumps;
  this.height = 50;
  this.width = 20;
  this.collideHeight = 50;
  this.collideWidth = 20;
  this.runnerAnimator = new RunnerAnimator(this);
};

Runner.prototype.draw = function (ctx) {
  // delegates to RunnerAnimator
  this.runnerAnimator.draw(ctx);
};

Runner.prototype.move = function () {
  // make the movement for this frame based on last frame's
  // velocity
  this.pos = Util.vectorSum(this.pos, this.vel);
  // then add the constant velocity components for the next frame
  this.vel = Physics.addGravity(this.vel);
  this.vel = Physics.addFriction(this.vel);
  // and determine the state to start the next frame
  this.determineState();
};

Runner.prototype.determineState = function () {
  // uses previous state, previous contact type, and
  // current velocity to determine current runner state

  var newState;
  if (this.vel[1] > 1 && this.vel[0] >= 0) {
    newState = 'flip-right';
  } else if (this.vel[1] > 1 && this.vel[0] < 0) {
    newState = 'flip-left';
  } else if (this.vel[0] > 0) {
    newState = 'run-right';
  } else if (this.vel[0] < 0) {
    newState = 'run-left';
  } else if (this.vel[0] === 0 &&
    (this.prevFrameState === 'run-right' ||
    this.prevFrameState === 'stand-right' ||
    this.prevFrameState === 'flip-right')) {
    newState = 'stand-right';
  } else if (this.vel[0] === 0 &&
    (this.prevFrameState === 'run-left' ||
    this.prevFrameState === 'stand-left' ||
    this.prevFrameState === 'flip-left')) {
    newState = 'stand-left';
  } else {
    newState = 'stand-right';
  }

  // uses state to set sprite
  this.runnerAnimator.setSprite(newState);

  // also control for size
  if (newState === 'flip-right' ||
  newState === 'flip-left') {
    this.height = 40;
    this.width = 40;
  } else {
    this.height = 50;
    this.width = 20;
  }

  this.prevFrameState = this.frameState;
  this.frameState = newState;

};

Runner.prototype.handleContact = function (contact) {
  // handles contact detail object passed from Physics
  if (contact.contactType === 'stand') {
    this.jumpsRemaining = gameConstants.numJumps;
    this.standOnPlatform();
    this.lastContactType = 'stand';
  }
  if (contact.contactType === 'collision') {
    this.jumpsRemaining = gameConstants.numJumps;
    this.collideWithPlatform(contact.stopPos);
    if (contact.fromDirection === 'above') {
      this.lastContactType = 'collision';
    }
  }
  if (contact.contactType === 'stick') {
    this.jumpsRemaining = gameConstants.numJumps;
    // this.stickToWall(); not written yet
    this.lastContactType = 'stick';
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

  if (!(Math.sign(this.vel[0]) === sign &&
    Math.abs(this.vel[0]) > gameConstants.maxRunVel)) {
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
  if (this.jumpsRemaining > 0) {
    // change vertical velocity immediately to jump velocity
    // regardless of previous velocity (otherwise double jumps
    // feel weak)
    this.vel = [this.vel[0], -(gameConstants.jumpVel)];
    this.jumpsRemaining -= 1;
  }
};

module.exports = Runner;
