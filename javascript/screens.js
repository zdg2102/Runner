// handles screen-level display information

var Screens = function (game) {
  this.game = game;
};

Screens.prototype.displayScore = function (ctx) {
  ctx.fillStyle = 'rgb(0, 0, 0)';
  ctx.font = "36px sans-serif";
  var displayDistance = Math.floor(this.game.runnerDistance / 100);
  var x = 900;
  var offset = displayDistance.toString().length;
  x -= (offset * 20);
  ctx.fillText(displayDistance + " m", x, 60);
};

Screens.prototype.displayPause = function (ctx) {
  ctx.fillStyle = 'rgba(205, 201, 201, 0.7)';
  ctx.fillRect(0, 0, this.game.frameWidth, this.game.frameHeight);
  ctx.fillStyle = 'rgb(255, 255, 255)';
  ctx.font = "36px sans-serif";
  ctx.fillText("PAUSED", 50, 75);
};

Screens.prototype.displayTitleScreen = function (ctx) {
  ctx.fillStyle = 'rgba(205, 201, 201, 0.7)';
  ctx.fillRect(0, 0, this.game.frameWidth, this.game.frameHeight);
  ctx.fillStyle = 'rgb(255, 255, 255)';
  ctx.font = '130px sans-serif';
  ctx.fillText("RUNNER", 50, 180);
  ctx.font = '24px sans-serif';
  ctx.fillText("LEFT and RIGHT (or A and D) to run", 50, 300);
  ctx.fillText("UP (or W) to jump", 50, 350);
  ctx.fillText("UP (or W) again to double jump", 50, 400);
  ctx.fillText("P to pause", 50, 450);
  ctx.font = '40px sans-serif';
  ctx.fillText("Press Enter to play", 340, 550);
};

Screens.prototype.displayDeath = function (ctx) {
  ctx.fillStyle = 'rgba(205, 201, 201, 0.7)';
  ctx.fillRect(0, 0, this.game.frameWidth, this.game.frameHeight);
  ctx.fillStyle = 'rgb(255, 255, 255)';
  ctx.font = '40px sans-serif';
  ctx.fillText("You died", 420, 200);
  ctx.fillText("Press Enter to restart", 300, 550);
};

module.exports = Screens;
