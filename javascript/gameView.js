// handles game's interaction wtih canvas element

var GameView = function (game, ctx) {
  this.game = game;
  this.ctx = ctx;
};

GameView.prototype.launch = function () {
  this.bindKeyHandlers();
  window.requestAnimationFrame(function () {
    this.advanceFrame();
  }.bind(this));
};

GameView.prototype.advanceFrame = function () {

};

GameView.prototype.bindKeyHandlers = function () {

};

module.exports = GameView;



  // Asteroids.GameView = function (game, ctx) {
  //   this.game = game;
  //   this.ctx = ctx;
  // };
  //
  // Asteroids.GameView.prototype.start = function (img) {
  //   this.bindKeyHandlers();
  //   root.setInterval( function () {
  //     this.ctx.clearRect(0, 0, this.game.DIM_X, this.game.DIM_Y);
  //     this.ctx.drawImage(img, 0, 0, this.game.DIM_X, this.game.DIM_Y);
  //     this.checkHeldKeys();
  //     this.game.draw(this.ctx);
  //     this.game.step();
  //   }.bind(this), 16);
  // };
  //
  // Asteroids.GameView.prototype.checkHeldKeys = function () {
  //   if (key.isPressed('left')) {
  //     this.game.ship.power([-0.2,0]);
  //   } else if (key.isPressed('right')) {
  //     this.game.ship.power([0.2,0]);
  //   } else if (key.isPressed('up')) {
  //     this.game.ship.power([0,-0.2]);
  //   } else if (key.isPressed('down')) {
  //     this.game.ship.power([0,0.2]);
  //   }
  // };
  //
  // Asteroids.GameView.prototype.bindKeyHandlers = function () {
  //   key('space', function () {
  //     this.game.ship.fireBullet();
  //   }.bind(this));
  // };
