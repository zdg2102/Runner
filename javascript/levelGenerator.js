// manages generation and storage of environment objects

var gameConstants = require('./gameConstants');
var Platform = require('./platform');
var Mine = require('./mine');

var LevelGenerator = function (game) {
  this.game = game;
  this.platforms = [];
  this.mines = [];
  this.nextVerticalPos = 0;
  this.nextGap = 0;
  this.lastPlatform = null;
  this.mineSprite = null;
  this.setFirstPlatform();
  this.setNextValues();
  // TODO: set up mine generation
  // this.loadMineSprite();
};

LevelGenerator.prototype.randPlatformHeight = function () {
  return gameConstants.platformMinHeight +
    Math.round(gameConstants.platformAddHeight * Math.random());
};

LevelGenerator.prototype.randPlatformWidth = function () {
  return gameConstants.platformMinWidth +
    Math.round(gameConstants.platformAddWidth * Math.random());
};

LevelGenerator.prototype.loadMineSprite = function () {
  this.mineSprite = window.document.getElementById('mine');
};

LevelGenerator.prototype.setFirstPlatform = function () {
  // guarantee first platform is always in the same position
  var firstPlatform = new Platform([300, 400], 30, 300);
  // set it as last platform so next generation can refer
  // to it
  this.lastPlatform = firstPlatform;
  this.platforms.push(firstPlatform);
};

LevelGenerator.prototype.lastPlatformTop = function () {
  if (this.lastPlatform) {
    return this.lastPlatform.pos[1];
  }
};

LevelGenerator.prototype.lastPlatformEdge = function () {
  if (this.lastPlatform) {
    return this.lastPlatform.pos[0] + this.lastPlatform.width;
  }
};

LevelGenerator.prototype.setNextValues = function () {
  this.nextVerticalPos = this.platformVerticalPos();
  this.nextGap = this.platformGap();
};

LevelGenerator.prototype.platformVerticalPos = function () {
  // platform must be within band of 60 pixels from either
  // top or bottom of the screen, as well as at least 10 pixels
  // less than the previous platform top plus the max
  // jump magnitude
  // remember, y-offset is from the top so everything is backwards
  var forceBottom = this.game.frameHeight - 60;
  var forceTop = 60;
  var jumpTop = this.lastPlatformTop() -
    gameConstants.jumpMaxMagnitude + 10;
  var top = Math.max(forceTop, jumpTop);
  var heightBand = forceBottom - top;
  return top + Math.round(heightBand * Math.random());
};

LevelGenerator.prototype.platformGap = function () {
  // ensure that absolute distance to next platform is valid
  // (i.e. high platforms aren't far, far platforms aren't
  // high)
  var verticalGap = this.lastPlatformTop() - this.nextVerticalPos;
  var maxGap;
  if (verticalGap > 0) {
    maxGap = Math.round(
      Math.sqrt(
        Math.pow(gameConstants.jumpMaxMagnitude, 2) -
        Math.pow(verticalGap, 2)
      )
    );
  } else {
    maxGap = Math.round(
      Math.sqrt(Math.pow(gameConstants.jumpMaxMagnitude, 2) / 2)
    );
  }

  return maxGap;
};

LevelGenerator.prototype.checkAndAddPlatform = function () {
  // check on each frame, and when the next platform to be drawn
  // is about to come on the screen, generate it and pick the
  // next numbers
  if (this.lastPlatformEdge() + this.nextGap <
    this.game.frameWidth + 2) {
    var height = this.randPlatformHeight();
    var width = this.randPlatformWidth();
    var verticalPos = this.nextVerticalPos;
    var horizontalPos = this.game.frameWidth + 1;
    var newPlatform = new Platform([horizontalPos, verticalPos],
      height, width);
    // set it as last platform and select the numbers for
    // the next one to be generated
    this.lastPlatform = newPlatform;
    this.platforms.push(newPlatform);
    this.setNextValues();
  }
};

LevelGenerator.prototype.checkAndClearOffscreenPlatform = function () {
  // see if a platform has cleared the screen and delete it
  for (var i = 0; i < this.platforms.length; i++) {
    if (this.platforms[i].pos[0] + this.platforms[i].width < 0) {
      this.platforms.splice(i, 1);
      return;
    }
  }
  for (i = 0; i < this.mines.length; i++) {
    if (this.mines[i].pos[0] + this.mines[i].width < 0) {
      this.mines.splice(i, 1);
      return;
    }
  }

};

module.exports = LevelGenerator;
