// basic platform for running and jumping on

var gameConstants = require('./gameConstants');

var Platform = function (pos, height, width) {
  this.pos = pos;
  this.height = height;
  this.width = width;
};

Platform.prototype.draw = function (ctx) {
  ctx.fillStyle = 'rgb(96, 88, 119)';
  ctx.fillRect(this.pos[0], this.pos[1], this.width, this.height);
  ctx.beginPath();
  ctx.strokeStyle = 'rgb(0, 0, 0)';
  ctx.lineWidth = gameConstants.platformOutlineThickness;
  ctx.strokeRect(
    this.pos[0],
    this.pos[1] + gameConstants.platformOutlineThickness / 2,
    this.width,
    this.height - gameConstants.platformOutlineThickness / 2
  );
};

module.exports = Platform;
