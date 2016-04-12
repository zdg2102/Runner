/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	var RunnerGame = __webpack_require__(1);
	var GameView = __webpack_require__(2);
	
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


/***/ },
/* 1 */
/***/ function(module, exports) {

	var RunnerGame = function (frameHeight, frameWidth) {
	
	};
	
	module.exports = RunnerGame;


/***/ },
/* 2 */
/***/ function(module, exports) {

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


/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map