// controls animation of runner sprite

var gameConstants = require('./gameConstants');

var RunnerAnimator = function (runner) {
  this.runner = runner;
  this.spriteAssets = {};
  this.spriteFrame = 1;
  this.spriteFrameCount = {
    'stand-right': 1,
    'stand-left': 1,
    'run-right': 6,
    'run-left': 6,
    'flip-right': 6,
    'flip-left': 6
  };
  this.loadSpriteAssets();
};

RunnerAnimator.prototype.loadSpriteAssets = function () {
  var spriteIds = ['stand-right1', 'stand-left1', 'run-right1',
    'run-right2', 'run-right3', 'run-right4', 'run-right5',
    'run-right6', 'run-left1', 'run-left2', 'run-left3',
    'run-left4', 'run-left5', 'run-left6', 'flip-right1', 'flip-right2',
    'flip-right3', 'flip-right4', 'flip-right5', 'flip-right6',
    'flip-left1', 'flip-left2', 'flip-left3', 'flip-left4',
    'flip-left5', 'flip-left6'];
  spriteIds.forEach(function (id) {
    this.spriteAssets[id] = window.document.getElementById(id);
  }.bind(this));
};

RunnerAnimator.prototype.draw = function (ctx) {
  // draw frame for debugging
  ctx.fillStyle = 'blue';
  ctx.fillRect(this.runner.pos[0], this.runner.pos[1],
    this.runner.width, this.runner.height);

  var id = this.runner.frameState + (Math.floor(this.spriteFrame /
    gameConstants.framesPerSprite) + 1);
  var sprite = this.spriteAssets[id];
  ctx.drawImage(
    sprite, this.runner.pos[0], this.runner.pos[1], this.runner.width,
      this.runner.height
  );
};

RunnerAnimator.prototype.setSprite = function (newState) {
  if (newState === this.runner.prevFrameState) {
    if (this.spriteFrame + 1 < this.spriteFrameCount[newState] *
      gameConstants.framesPerSprite) {
      this.spriteFrame = this.spriteFrame + 1;
    } else {
      this.spriteFrame = 1;
    }
  } else {
    this.spriteFrame = 1;
  }
};

module.exports = RunnerAnimator;
