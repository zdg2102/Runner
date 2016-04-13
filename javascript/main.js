var RunnerGame = require('./game');
var GameView = require('./gameView');

window.document.addEventListener('DOMContentLoaded', function () {
  var canvas = window.document.getElementById("canvas");
  var ctx = canvas.getContext("2d");
  var canvasHeight = 650;
  var canvasWidth = 1000;
  ctx.canvas.height = canvasHeight;
  ctx.canvas.width = canvasWidth;
  var game = new RunnerGame(canvasHeight, canvasWidth);
  var gameView = new GameView(game, ctx);
  gameView.launch();
})
