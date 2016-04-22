// main game file

var GameControls = require('./gameControls');
var Platform = require('./platform');
var Runner = require('./runner');
var Util = require('./util');
var Physics = require('./physics');
var gameConstants = require('./gameConstants');
var LevelGenerator = require('./levelGenerator');
var BackgroundGenerator = require('./backgroundGenerator');

var RunnerGame = function (frameHeight, frameWidth) {
  this.frameHeight = frameHeight;
  this.frameWidth = frameWidth;
  this.levelGenerator = new LevelGenerator(this);
  this.platforms = this.levelGenerator.platforms;
  this.backgroundGenerator = new BackgroundGenerator(this);
  this.backgroundObjects = this.backgroundGenerator.backgroundObjects;
  this.runner = new Runner([320, 350]);
  this.runnerDistance = 0;
  this.isPaused = false;
  this.isInIntro = true;
  this.isRunnerDead = false;
  GameControls.bindKeyHandlers(this, this.runner);
};

RunnerGame.prototype.allObjects = function () {
  // background objects are added first so everything
  // else is drawn on top of them
  return this.backgroundObjects.concat(this.platforms)
    .concat([this.runner]);
};

RunnerGame.prototype.foregroundObjects = function () {
  return this.platforms.concat([this.runner]);
};

RunnerGame.prototype.environmentObjects = function () {
  return this.platforms.slice();
};

RunnerGame.prototype.draw = function (ctx) {
  ctx.fillStyle = 'rgb(135, 206, 250)';
  ctx.fillRect(0, 0, this.frameWidth, this.frameHeight);
  this.allObjects().forEach(function (obj) {
    obj.draw.call(obj, ctx);
  });
  if (!this.isInIntro) {
    this.displayScore(ctx);
  }
  // draw pause overlay if game is paused
  if (this.isPaused) {
    this.displayPause(ctx);
  }
  if (this.isInIntro) {
    this.displayTitleScreen(ctx);
  }
  if (this.isRunnerDead) {
    this.displayDeath(ctx);
  }
};

RunnerGame.prototype.displayScore = function (ctx) {
  ctx.fillStyle = 'rgb(0, 0, 0)';
  ctx.font = "36px sans-serif";
  var displayDistance = Math.floor(this.runnerDistance / 100);
  ctx.fillText(displayDistance + " m", 900, 60);
};

RunnerGame.prototype.closeInfoScreen = function () {
  if (!this.isRunnerDead) {
    // in this case we're closing the intro screen
    this.isInIntro = false;
  } else {
    // otherwise we're resetting the game
    this.isRunnerDead = false;
    this.isInIntro = true;
    this.runner.pos = [320, 350];
    this.runner.vel = [0, 0];
    this.runner.width = 20;
    this.runner.height = 50;
    this.runner.frameState = 'stand-right';
    this.runner.runnerAnimator.spriteFrame = 1;
    this.levelGenerator = new LevelGenerator(this);
    this.platforms = this.levelGenerator.platforms;
    this.backgroundGenerator = new BackgroundGenerator(this);
    this.backgroundObjects = this.backgroundGenerator.backgroundObjects;
  }
};

RunnerGame.prototype.togglePause = function () {
  this.isPaused = !this.isPaused;
};

RunnerGame.prototype.displayPause = function (ctx) {
  ctx.fillStyle = 'rgba(205, 201, 201, 0.7)';
  ctx.fillRect(0, 0, this.frameWidth, this.frameHeight);
  ctx.fillStyle = 'rgb(255, 255, 255)';
  ctx.font = "36px sans-serif";
  ctx.fillText("PAUSED", 50, 75);
};

RunnerGame.prototype.displayTitleScreen = function (ctx) {
  ctx.fillStyle = 'rgba(205, 201, 201, 0.7)';
  ctx.fillRect(0, 0, this.frameWidth, this.frameHeight);
  ctx.fillStyle = 'rgb(255, 255, 255)';
  ctx.font = '130px sans-serif';
  ctx.fillText("RUNNER", 50, 180);
  ctx.font = '24px sans-serif';
  ctx.fillText("LEFT and RIGHT to run", 50, 300);
  ctx.fillText("UP to jump", 50, 350);
  ctx.fillText("UP again to double jump", 50, 400);
  ctx.fillText("P to pause", 50, 450);
  ctx.font = '40px sans-serif';
  ctx.fillText("Press Enter to play", 340, 550);
};

RunnerGame.prototype.displayDeath = function (ctx) {
  ctx.fillStyle = 'rgba(205, 201, 201, 0.7)';
  ctx.fillRect(0, 0, this.frameWidth, this.frameHeight);
  ctx.fillStyle = 'rgb(255, 255, 255)';
  ctx.font = '40px sans-serif';
  ctx.fillText("You died", 420, 200);
  ctx.fillText("Press Enter to restart", 300, 550);
};

RunnerGame.prototype.advanceFrame = function () {
  if (!this.isPaused && !this.isInIntro && !this.isRunnerDead) {
    GameControls.checkHeldKeys(this.runner);
    this.checkRunnerDeath();
    this.checkRunnerContact();
    this.runner.move();
    this.scroll();
    this.levelGenerator.checkAndAddPlatform();
    this.backgroundGenerator.checkAndAddBuilding();
    this.levelGenerator.checkAndClearOffscreenPlatform();
  }
};

RunnerGame.prototype.scroll = function () {
  var scrollMovement = [-(gameConstants.scrollSpeed), 0];
  var parallaxScrollMovement = [
    -(gameConstants.scrollSpeed * gameConstants.parallaxFactor),
    0
  ];
  this.foregroundObjects().forEach(function (obj) {
    obj.pos = Util.vectorSum(obj.pos, scrollMovement);
  });
  this.backgroundObjects.forEach(function (obj) {
    obj.pos = Util.vectorSum(obj.pos, parallaxScrollMovement);
  });
  this.runnerDistance += gameConstants.scrollSpeed;
};

RunnerGame.prototype.checkRunnerContact = function () {
  // determine if the runner is in contact with any
  // environment objects
  this.environmentObjects().forEach(function (obj) {
    var contact = Physics.detectContact(this.runner, obj);
    if (contact) {
      this.runner.handleContact(contact);
    }
  }.bind(this));
};

RunnerGame.prototype.checkRunnerDeath = function () {
  // determine if the runner died
  // going off the top of the screen won't kill you
  if (this.runner.pos[0] > this.frameWidth ||
    this.runner.pos[0] + this.runner.width < 0 ||
    this.runner.pos[1] > this.frameHeight) {
    this.isRunnerDead = true;
  }
};

module.exports = RunnerGame;
