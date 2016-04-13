// main game file

var GameControls = require('./gameControls');
var Platform = require('./platform');
var Runner = require('./runner');
var Util = require('./util');
var Physics = require('./physics');
var gameConstants = require('./gameConstants');
var LevelGenerator = require('./levelGenerator');

var RunnerGame = function (frameHeight, frameWidth) {
  this.frameHeight = frameHeight;
  this.frameWidth = frameWidth;
  this.levelGenerator = new LevelGenerator(this);
  this.platforms = this.levelGenerator.platforms;
  this.runner = new Runner([150, 370]);
  // set the jump key on the runner
  GameControls.bindKeyHandlers(this.runner);
};

RunnerGame.prototype.allObjects = function () {
  return this.platforms.concat([this.runner]);
};

RunnerGame.prototype.environmentObjects = function () {
  return this.platforms.slice();
};

RunnerGame.prototype.draw = function (ctx) {
  this.allObjects().forEach(function (obj) {
    obj.draw.call(obj, ctx);
  });
};

RunnerGame.prototype.advanceFrame = function () {
  GameControls.checkHeldKeys(this.runner);
  this.runner.move();
  this.checkRunnerContact();
  this.scroll();
  this.levelGenerator.checkAndAddPlatform();
};

RunnerGame.prototype.scroll = function () {
  var scrollMovement = [-(gameConstants.scrollSpeed), 0]
  this.allObjects().forEach(function (obj) {
    obj.pos = Util.vectorSum(obj.pos, scrollMovement);
  });
};

RunnerGame.prototype.checkRunnerContact = function () {
  // determine if the runner made contact with any
  // environment objects
  this.environmentObjects().forEach(function (obj) {
    var contact = Physics.detectContact(this.runner, obj);
    if (contact) {
      this.runner.handleContact(contact);
    }
  }.bind(this))
};

module.exports = RunnerGame;
