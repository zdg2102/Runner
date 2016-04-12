var Platform = require('./platform');
var Runner = require('./runner');
var Util = require('./util');

var RunnerGame = function (frameHeight, frameWidth) {
  this.frameHeight = frameHeight;
  this.frameWidth = frameWidth;
  this.platforms = [];
  this.runner = new Runner([150, 40]);

  var testPlatform = new Platform([100, 400], 100, 800);
  this.platforms.push(testPlatform);
};

// RunnerGame.prototype.test = function (ctx) {
//   this.testRunner.move();
//   this.testPlatform.draw(ctx);
//   this.testRunner.draw(ctx);
// };

RunnerGame.prototype.allObjects = function () {
  return this.platforms.concat([this.runner]);
}

RunnerGame.prototype.environmentObjects = function () {
  return this.platforms.concat([]);
};

RunnerGame.prototype.draw = function (ctx) {
  this.allObjects().forEach(function (obj) {
    obj.draw.call(obj, ctx);
  })
}

RunnerGame.prototype.step = function () {
  this.runner.move();
  this.checkRunnerCollisions();
}

RunnerGame.prototype.checkRunnerCollisions = function () {
  this.environmentObjects().forEach(function (obj) {
    var stopPos = Util.detectCollision(this.runner, obj);
    if (stopPos) {
      // debugger;
      this.runner.collideWithPlatform(stopPos);
    }
  }.bind(this))
};

module.exports = RunnerGame;
