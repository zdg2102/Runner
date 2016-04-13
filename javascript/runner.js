// the player-controlled character

var Util = require('./util');
var Physics = require('./physics');

var Runner = function (startingPos) {
  this.objType = "runner";
  this.pos = startingPos;
  this.vel = [0, 0];
  this.height = 30;
  this.width = 15;
};

Runner.prototype.draw = function (ctx) {
  ctx.fillStyle = "blue";
  ctx.fillRect(this.pos[0], this.pos[1], this.width, this.height)
};

Runner.prototype.move = function () {
  // make the movement for this frame based on last frame's
  // velocity
  this.pos = Util.vectorSum(this.pos, this.vel);
  // then add gravity, since that is included in every frame
  this.vel = Physics.addGravity(this.vel);
};

Runner.prototype.standOnPlatform = function () {
  this.vel = [this.vel[0], this.vel[1] - 0.3];
};

Runner.prototype.collideWithPlatform = function (stopPos) {
  // fully stop (not realistic, but feels less slippery)
  this.vel = [0, 0];
  this.pos = stopPos;
};

Runner.prototype.runAccelerate = function (dir) {
  if (dir === "left") {
    this.vel = [this.vel[0] - 1, this.vel[1]];
  } else if (dir === "right") {
    this.vel = [this.vel[0] + 1, this.vel[1]];
  }
};

Runner.prototype.jump = function () {
  this.vel = [this.vel[0], this.vel[1] + 4];
}

module.exports = Runner;
