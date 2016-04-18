// handles game's interaction wtih canvas element

var GameView = function (game, ctx) {
  this.game = game;
  this.ctx = ctx;
};

GameView.prototype.drawFrameAndLoop = function () {
  window.requestAnimationFrame(function () {
    this.generateFrame();
  }.bind(this));
};

GameView.prototype.generateFrame = function () {
  this.ctx.clearRect(0, 0, this.game.frameWidth, this.game.frameHeight);
  this.game.draw(this.ctx);
  this.game.advanceFrame();
  this.drawFrameAndLoop();
};

module.exports = GameView;
