// loader for attaching to canvas DOM element

// var RunnerGame = require('./game');
// var GameView = require('./gameView');

window.document.addEventListener('DOMContentLoaded', function () {
  var canvas = window.document.getElementById('canvas');
  var ctx = canvas.getContext('2d');
  ctx.canvas.height = 650;
  ctx.canvas.width = 1000;
  var game = new RunnerGame(ctx.canvas.height, ctx.canvas.width);
  var gameView = new GameView(game, ctx);
  gameView.drawFrameAndLoop();
})
