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


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	// main game file
	
	var Platform = __webpack_require__(2);
	var Runner = __webpack_require__(3);
	var Util = __webpack_require__(4);
	var Physics = __webpack_require__(6);
	
	var RunnerGame = function (frameHeight, frameWidth) {
	  this.frameHeight = frameHeight;
	  this.frameWidth = frameWidth;
	  this.platforms = [];
	
	  // FINDTAG
	  this.runner = new Runner([150, 40]);
	  var testPlatform = new Platform([100, 400], 100, 800);
	  this.platforms.push(testPlatform);
	};
	
	RunnerGame.prototype.allObjects = function () {
	  return this.platforms.concat([this.runner]);
	};
	
	RunnerGame.prototype.environmentObjects = function () {
	  return this.platforms.slice();
	};
	
	RunnerGame.prototype.draw = function (ctx) {
	  this.allObjects().forEach(function (obj) {
	    obj.draw.call(obj, ctx);
	  })
	};
	
	RunnerGame.prototype.step = function () {
	  this.runner.move();
	  this.checkRunnerCollisions();
	};
	
	RunnerGame.prototype.checkRunnerCollisions = function () {
	  this.environmentObjects().forEach(function (obj) {
	    var stopPos = Physics.detectContact(this.runner, obj);
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
	var Physics = __webpack_require__(6);
	
	var Runner = function (startingPos) {
	  this.objType = "runner";
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
	  // make the movement for this frame based on last frame's
	  // velocity
	  this.pos = Util.vectorSum(this.pos, this.vel);
	  // then add gravity, since that is included in every frame
	  this.vel = Physics.addGravity(this.vel);
	};
	
	Runner.prototype.standOnPlatform = function () {
	  this.vel = [this.vel[0], this.vel[1] - 0.3];
	};
	
	Runner.prototype.collideWithPlatform = function (stopPos) {
	  // fully stop (not realistic, but feels less slippery)
	  this.vel = [0, 0];
	  this.pos = stopPos;
	};
	
	Runner.prototype.runAccelerate = function (dir) {
	  if (dir === "left") {
	    this.vel = [this.vel[0] - 1, this.vel[1]];
	  } else if (dir === "right") {
	    this.vel = [this.vel[0] + 1, this.vel[1]];
	  }
	};
	
	Runner.prototype.jump = function () {
	  this.vel = [this.vel[0], this.vel[1] + 4];
	}
	
	module.exports = Runner;


/***/ },
/* 4 */
/***/ function(module, exports) {

	// general use functions
	
	var Util = {
	
	  inherits: function (ChildClass, ParentClass) {
	    var Surrogate = function () {};
	    Surrogate.prototype = ParentClass.prototype;
	    ChildClass.prototype = new Surrogate();
	    ChildClass.prototype.constructor = ChildClass;
	  },
	
	  vectorSum: function (vectorA, vectorB) {
	    var x = vectorA[0] + vectorB[0];
	    var y = vectorA[1] + vectorB[1];
	    return [x, y];
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
	      this.game.runner.runAccelerate("left");
	    } else if (key.isPressed('right')) {
	      this.game.runner.runAccelerate("right");
	  //   } else if (key.isPressed('up')) {
	  //     this.game.ship.power([0,-0.2]);
	  //   } else if (key.isPressed('down')) {
	  //     this.game.ship.power([0,0.2]);
	    }
	}
	
	GameView.prototype.bindKeyHandlers = function () {
	    key('return', function () {
	      this.game.runner.jump();
	    }.bind(this));
	};
	
	module.exports = GameView;


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	// for dealing with gravity and collisions
	
	var gameConstants = __webpack_require__(7);
	var Util = __webpack_require__(4);
	
	var Physics = {
	
	  addGravity: function (vel) {
	    var gravityVector = [0, gameConstants.gravity];
	    return Util.vectorSum(vel, gravityVector);
	  },
	
	  addNormalForce: function (vel) {
	    var normalForceVector = [0, -(gameConstants.gravity)];
	    return Util.vectorSum(vel, normalForceVector);
	  },
	
	  detectContact: function (objA, objB) {
	    // if there is contact, returns an object containing
	    // information on the contact
	    // otherwise returns null
	    var objALeft = objA.pos[0];
	    var objARight = objA.pos[0] + objA.width;
	    var objATop = objA.pos[1];
	    var objABottom = objA.pos[1] + objA.height;
	    var objBLeft = objB.pos[0];
	    var objBRight = objB.pos[0] + objB.width;
	    var objBTop = objB.pos[1];
	    var objBBottom = objB.pos[1] + objB.height;
	    if (objABottom >= objBTop && objABottom < objBBottom) {
	      // objA hits objB from above
	      return [objALeft, objBTop - objA.height]
	    } else if (objATop <= objBBottom && objATop > objBTop) {
	      // objA hits objB from below
	
	    } else if (objARight >= objBLeft && objARight < objBRight) {
	      // objA hits objB from the left
	
	    } else if (objALeft <= objBRight && objALeft > objBLeft) {
	      // objA hits objB from the right
	
	    } else {
	      return null;
	    }
	  }
	
	};
	
	module.exports = Physics;


/***/ },
/* 7 */
/***/ function(module, exports) {

	// all constants, to allow for easier adjustments
	
	var gameConstants = {
	
	  gravity: 0.3,
	
	  maxRunVel: 4,
	
	  runAccel: 2,
	
	  jumpAccel: 4,
	
	  deAccel: 0.3,
	
	};
	
	module.exports = gameConstants;


/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map