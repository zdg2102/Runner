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
	var GameView = __webpack_require__(5);
	
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
/***/ function(module, exports, __webpack_require__) {

	var Platform = __webpack_require__(2);
	var Runner = __webpack_require__(3);
	var Util = __webpack_require__(4);
	
	var RunnerGame = function (frameHeight, frameWidth) {
	  this.frameHeight = frameHeight;
	  this.frameWidth = frameWidth;
	  this.platforms = [];
	  this.runner = new Runner([150, 40]);
	
	  var testPlatform = new Platform([100, 400], 100, 800);
	  this.platforms.push(testPlatform);
	};
	
	// RunnerGame.prototype.test = function (ctx) {
	//   this.testRunner.move();
	//   this.testPlatform.draw(ctx);
	//   this.testRunner.draw(ctx);
	// };
	
	RunnerGame.prototype.allObjects = function () {
	  return this.platforms.concat([this.runner]);
	}
	
	RunnerGame.prototype.environmentObjects = function () {
	  return this.platforms.concat([]);
	};
	
	RunnerGame.prototype.draw = function (ctx) {
	  this.allObjects().forEach(function (obj) {
	    obj.draw.call(obj, ctx);
	  })
	}
	
	RunnerGame.prototype.step = function () {
	  this.runner.move();
	  this.checkRunnerCollisions();
	}
	
	RunnerGame.prototype.checkRunnerCollisions = function () {
	  this.environmentObjects().forEach(function (obj) {
	    var stopPos = Util.detectCollision(this.runner, obj);
	    if (stopPos) {
	      // debugger;
	      this.runner.collideWithPlatform(stopPos);
	    }
	  }.bind(this))
	};
	
	module.exports = RunnerGame;


/***/ },
/* 2 */
/***/ function(module, exports) {

	// basic platform for running and jumping on
	// a platform's position is defined by its top-left corner
	
	var Platform = function (pos, height, width) {
	  this.pos = pos;
	  this.height = height;
	  this.width = width;
	}
	
	Platform.prototype.draw = function (ctx) {
	  ctx.fillStyle = "rgb(96, 88, 119)"
	  ctx.fillRect(this.pos[0], this.pos[1], this.width, this.height)
	}
	
	module.exports = Platform;


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	// the player-controlled character
	
	var Util = __webpack_require__(4);
	
	var Runner = function (startingPos) {
	  this.pos = startingPos;
	  this.vel = [0, 0];
	  this.height = 30;
	  this.width = 15;
	};
	
	Runner.prototype.draw = function (ctx) {
	  ctx.fillStyle = "blue";
	  ctx.fillRect(this.pos[0], this.pos[1], this.width, this.height)
	};
	
	Runner.prototype.move = function () {
	  this.pos = [this.pos[0] + this.vel[0],
	  this.pos[1] + this.vel[1]];
	  this.vel = Util.gravity(this.vel);
	};
	
	Runner.prototype.collideWithPlatform = function (stopPos) {
	  this.vel = [0, 0];
	  this.pos = stopPos;
	};
	
	module.exports = Runner;


/***/ },
/* 4 */
/***/ function(module, exports) {

	var Util = {
	  inherits: function (ChildClass, ParentClass) {
	    var Surrogate = function () {};
	    Surrogate.prototype = ParentClass.prototype;
	    ChildClass.prototype = new Surrogate();
	    ChildClass.prototype.constructor = ChildClass;
	  },
	
	  gravity: function (vel) {
	    return [vel[0], vel[1] + 0.3]
	  },
	
	  detectCollision: function (obj1, obj2) {
	    // if there is a collision, returns the point obj1 should
	    // stop at
	    // otherwise returns null
	    var obj1Left = obj1.pos[0];
	    var obj1Right = obj1.pos[0] + obj1.width;
	    var obj1Top = obj1.pos[1];
	    var obj1Bottom = obj1.pos[1] + obj1.height;
	    var obj2Left = obj2.pos[0];
	    var obj2Right = obj2.pos[0] + obj2.width;
	    var obj2Top = obj2.pos[1];
	    var obj2Bottom = obj2.pos[1] + obj2.height;
	    if (obj1Bottom >= obj2Top && obj1Bottom < obj2Bottom) {
	      // obj1 hits obj2 from above
	      return [obj1Left, obj2Top - obj1.height]
	    } else if (obj1Top <= obj2Bottom && obj1Top > obj2Top) {
	      // obj1 hits obj2 from below
	
	    } else if (obj1Right >= obj2Left && obj1Right < obj2Right) {
	      // obj1 hits obj2 from the left
	
	    } else if (obj1Left <= obj2Right && obj1Left > obj2Left) {
	      // obj1 hits obj2 from the right
	
	    } else {
	      return null;
	    }
	  }
	};
	
	module.exports = Util;


/***/ },
/* 5 */
/***/ function(module, exports) {

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
	    if (key.isPressed('left')) {
	      this.game.runner.vel = [-1, 0];
	    } else if (key.isPressed('right')) {
	      this.game.runner.vel = [1, 0];
	  //   } else if (key.isPressed('up')) {
	  //     this.game.ship.power([0,-0.2]);
	  //   } else if (key.isPressed('down')) {
	  //     this.game.ship.power([0,0.2]);
	    }
	}
	
	GameView.prototype.bindKeyHandlers = function () {
	  //   key('space', function () {
	  //     this.game.ship.fireBullet();
	  //   }.bind(this));
	};
	
	module.exports = GameView;


/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map