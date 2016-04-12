// the player-controlled character

var Util = require('./util');

var Runner = function (startingPos) {
  this.pos = startingPos;
  this.vel = [0, 0];
  this.height = 30;
  this.width = 15;
};

Runner.prototype.draw = function (ctx) {
  ctx.fillStyle = "blue";
  ctx.fillRect(this.pos[0], this.pos[1], this.width, this.height)
}

Runner.prototype.move = function () {
  this.vel = Util.gravity(this.vel);
  this.pos = [this.pos[0] + this.vel[0],
  this.pos[1] + this.vel[1]];
}

module.exports = Runner;
