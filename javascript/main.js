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


// <script type="text/javascript">
//   var canvas = document.getElementById("canvas")
//   var ctx = canvas.getContext("2d");
//   ctx.canvas.width = window.innerWidth - 50;
//   ctx.canvas.height = window.innerHeight - 50;
//   var img = new Image();
//   img.onload = function () {
//     ctx.drawImage(img, 0, 0, ctx.canvas.width, ctx.canvas.height);
//   };
//   img.src = "./starsBackground.jpg";
//   var game = new Asteroids.Game(ctx.canvas.width, ctx.canvas.height);
//   var gameView = new Asteroids.GameView(game, ctx);
//   gameView.start(img);
// </script>
