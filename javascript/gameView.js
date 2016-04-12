// handles game's interaction wtih canvas element

var GameView = function (game, ctx) {
  this.game = game;
  this.ctx = ctx;
};

GameView.prototype.launch = function () {
  this.bindKeyHandlers();
  this.drawNextFrame();
};

GameView.prototype.drawNextFrame = function () {
  window.requestAnimationFrame(function () {
    this.generateFrame();
  }.bind(this))
}

GameView.prototype.generateFrame = function () {
  this.ctx.clearRect(0, 0, this.game.frameWidth, this.game.frameHeight)
  this.checkHeldKeys();
  this.game.draw(this.ctx);
  this.game.step();
  this.drawNextFrame();
};

GameView.prototype.checkHeldKeys = function () {
  //   if (key.isPressed('left')) {
  //     this.game.ship.power([-0.2,0]);
  //   } else if (key.isPressed('right')) {
  //     this.game.ship.power([0.2,0]);
  //   } else if (key.isPressed('up')) {
  //     this.game.ship.power([0,-0.2]);
  //   } else if (key.isPressed('down')) {
  //     this.game.ship.power([0,0.2]);
  //   }
}

GameView.prototype.bindKeyHandlers = function () {
  //   key('space', function () {
  //     this.game.ship.fireBullet();
  //   }.bind(this));
};

module.exports = GameView;
