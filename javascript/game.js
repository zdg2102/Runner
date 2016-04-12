var Platform = require('./platform');
var Runner = require('./runner');

var RunnerGame = function (frameHeight, frameWidth) {
  this.frameHeight = frameHeight;
  this.frameWidth = frameWidth;

  this.testPlatform = new Platform([100, 400], 100, 800);
  this.testRunner = new Runner([150, 40]);
};

RunnerGame.prototype.test = function (ctx) {
  this.testRunner.move();
  this.testPlatform.draw(ctx);
  this.testRunner.draw(ctx);
}

module.exports = RunnerGame;
