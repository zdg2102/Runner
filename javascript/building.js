// building outline for background fill

var gameConstants = require('./gameConstants');

var Building = function (pos, width, height) {
  this.pos = pos;
  this.height = height;
  this.width = width;
  this.r = 0;
  this.g = 0;
  this.b = 0;
  this.setColor();
};

Building.prototype.setColor = function () {
  // every fifth building or so make a gap
  if (Math.random() < 0.2) {
    this.r = null;
    this.g = null;
    this.b = null;
  } else {
    this.r = Math.floor(200 + Math.random() * 20);
    this.g = Math.floor(200 + Math.random() * 20);
    this.b = Math.floor(200 + Math.random() * 20);
  }
};

Building.prototype.draw = function (ctx) {
  // draw nothing if the color values are null
  if (this.r && this.g && this.b) {
    ctx.fillStyle = 'rgb(' + this.r + ',' + this.g + ',' + this.b + ')';
    ctx.fillRect(this.pos[0], this.pos[1], this.width, this.height);
  }
};

module.exports = Building;
