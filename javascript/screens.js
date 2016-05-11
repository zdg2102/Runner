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
  if (this.game.highScore > 0) {
    var displayScore = Math.floor(this.game.highScore / 100);
    ctx.font = '28px sans-serif';
    ctx.fillText("HIGH SCORE", 720, 100);
    var x = 890;
    var offset = displayScore.toString().length;
    x -= (offset * 33);
    ctx.font = '60px sans-serif';
    ctx.fillText(displayScore, x, 160);
  }
};

Screens.prototype.displayDeath = function (ctx) {
  ctx.fillStyle = 'rgba(205, 201, 201, 0.7)';
  ctx.fillRect(0, 0, this.game.frameWidth, this.game.frameHeight);
  ctx.fillStyle = 'rgb(255, 255, 255)';
  ctx.font = '40px sans-serif';
  ctx.fillText("YOU DIED", 420, 200);
  ctx.fillText("Press Enter to restart", 300, 550);
  var displayDistance = Math.floor(this.game.runnerDistance / 100);
  var displayScore = Math.floor(this.game.highScore / 100);
  ctx.fillText("Your score: " + displayDistance, 300, 320);
  if (this.game.runnerDistance > this.game.highScore) {
    ctx.fillText("NEW HIGH SCORE", 300, 380);
  } else {
    ctx.fillText("High score: " + displayScore, 300, 380);
  }
};

module.exports = Screens;
