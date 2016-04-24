// building outline for background fill

var gameConstants = require('./gameConstants');

var Building = function (pos, width, height, game) {
  this.pos = pos;
  this.height = height;
  this.width = width;
  this.game = game;
  this.r = 0;
  this.g = 0;
  this.b = 0;
  if (this.pos[1] > 120 && Math.random() < 0.15) {
    this.buildingType = 'right-slope';
  } else if (this.pos[1] > 120 && Math.random() < 0.15) {
    this.buildingType = 'left-slope';
  } else if (this.pos[1] > 120 && Math.random() < 0.15) {
    this.buildingType = 'pyramid';
  }
  this.windowSpacing = Math.round((this.width - 40) / 3);
  this.setColor();
};

Building.prototype.setColor = function () {
  // every fifth building or so make a gap
  if (Math.random() < 0.2) {
    this.r = null;
    this.g = null;
    this.b = null;
  } else {
    this.r = Math.round(160 + Math.random() * 20);
    this.g = Math.round(160 + Math.random() * 20);
    this.b = Math.round(160 + Math.random() * 20);
  }
};

Building.prototype.draw = function (ctx) {
  // draw nothing if the color values are null
  if (this.r && this.g && this.b) {
    ctx.fillStyle = 'rgb(' + this.r + ',' + this.g + ',' + this.b + ')';
    ctx.fillRect(this.pos[0], this.pos[1], this.width, this.height);
    this.addWindows(ctx);
    if (this.buildingType === 'right-slope') {
      this.addRightSlopeRoof(ctx);
    } else if (this.buildingType === 'left-slope') {
      this.addLeftSlopeRoof(ctx);
    } else if (this.buildingType === 'pyramid') {
      this.addPyramidRoof(ctx);
    }
  }
};

Building.prototype.addWindows = function (ctx) {
  var windowWidth = 10;
  var windowHeight = 30;
  var top = this.pos[1] + 40;
  var left = this.pos[0] + this.windowSpacing;
  ctx.fillStyle = 'rgb(230, 230, 230)';
  while (top < this.game.frameHeight) {
    while (left + windowWidth < this.pos[0] + this.width) {
      ctx.fillRect(left, top, windowWidth, windowHeight);
      left += this.windowSpacing;
    }
    top += 70;
    left = this.pos[0] + this.windowSpacing;
  }
};

Building.prototype.addRightSlopeRoof = function (ctx) {
  ctx.fillStyle = 'rgb(' + this.r + ',' + this.g + ',' + this.b + ')';
  ctx.beginPath();
  ctx.moveTo(this.pos[0], this.pos[1]);
  ctx.lineTo(this.pos[0] + this.width, this.pos[1] - 100);
  ctx.lineTo(this.pos[0] + this.width, this.pos[1] + 3);
  ctx.fill();
};

Building.prototype.addLeftSlopeRoof = function (ctx) {
  ctx.fillStyle = 'rgb(' + this.r + ',' + this.g + ',' + this.b + ')';
  ctx.beginPath();
  ctx.moveTo(this.pos[0] + this.width, this.pos[1]);
  ctx.lineTo(this.pos[0], this.pos[1] - 100);
  ctx.lineTo(this.pos[0], this.pos[1] + 3);
  ctx.fill();
};

Building.prototype.addPyramidRoof = function (ctx) {
  ctx.fillStyle = 'rgb(' + this.r + ',' + this.g + ',' + this.b + ')';
  ctx.beginPath();
  ctx.moveTo(this.pos[0], this.pos[1]);
  ctx.lineTo(this.pos[0] + Math.round(this.width / 2), this.pos[1] - 100);
  ctx.lineTo(this.pos[0] + this.width, this.pos[1] + 3);
  ctx.fill();
};


module.exports = Building;
