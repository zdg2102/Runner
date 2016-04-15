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

	// loader for attaching to canvas DOM element
	
	var RunnerGame = __webpack_require__(1);
	var GameView = __webpack_require__(9);
	
	window.document.addEventListener('DOMContentLoaded', function () {
	  var canvas = window.document.getElementById('canvas');
	  var ctx = canvas.getContext('2d');
	  ctx.canvas.height = 650;
	  ctx.canvas.width = 1000;
	  var game = new RunnerGame(ctx.canvas.height, ctx.canvas.width);
	  var gameView = new GameView(game, ctx);
	  gameView.drawFrameAndLoop();
	})


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	// main game file
	
	var GameControls = __webpack_require__(2);
	var Platform = __webpack_require__(3);
	var Runner = __webpack_require__(4);
	var Util = __webpack_require__(5);
	var Physics = __webpack_require__(6);
	var gameConstants = __webpack_require__(7);
	var LevelGenerator = __webpack_require__(8);
	
	var RunnerGame = function (frameHeight, frameWidth) {
	  this.frameHeight = frameHeight;
	  this.frameWidth = frameWidth;
	  this.levelGenerator = new LevelGenerator(this);
	  this.platforms = this.levelGenerator.platforms;
	  this.runner = new Runner([150, 340]);
	  // set the jump key on the runner
	  GameControls.bindKeyHandlers(this.runner);
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
	  });
	};
	
	RunnerGame.prototype.advanceFrame = function () {
	  GameControls.checkHeldKeys(this.runner);
	  this.checkRunnerContact();
	  this.runner.move();
	  this.scroll();
	  this.levelGenerator.checkAndAddPlatform();
	};
	
	RunnerGame.prototype.scroll = function () {
	  var scrollMovement = [-(gameConstants.scrollSpeed), 0]
	  this.allObjects().forEach(function (obj) {
	    obj.pos = Util.vectorSum(obj.pos, scrollMovement);
	  });
	};
	
	RunnerGame.prototype.checkRunnerContact = function () {
	  // determine if the runner is in contact with any
	  // environment objects
	  this.environmentObjects().forEach(function (obj) {
	    var contact = Physics.detectContact(this.runner, obj);
	    if (contact) {
	      this.runner.handleContact(contact);
	    }
	  }.bind(this))
	};
	
	module.exports = RunnerGame;


/***/ },
/* 2 */
/***/ function(module, exports) {

	// handles user input (using Keymaster library via global 'key')
	
	var GameControls = {
	
	  bindKeyHandlers: function (runner) {
	    key('up', function () {
	      runner.jump();
	    });
	  },
	
	  checkHeldKeys: function (runner) {
	    if (key.isPressed('left')) {
	      runner.runAccelerate('left');
	    } else if (key.isPressed('right')) {
	      runner.runAccelerate('right');
	    }
	  }
	
	};
	
	module.exports = GameControls;


/***/ },
/* 3 */
/***/ function(module, exports) {

	// basic platform for running and jumping on
	// a platform's position is defined by its top-left corner
	
	var Platform = function (pos, height, width) {
	  this.pos = pos;
	  this.height = height;
	  this.width = width;
	}
	
	Platform.prototype.draw = function (ctx) {
	  ctx.fillStyle = 'rgb(96, 88, 119)';
	  ctx.fillRect(this.pos[0], this.pos[1], this.width, this.height)
	}
	
	module.exports = Platform;


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	// the player-controlled character
	
	var Util = __webpack_require__(5);
	var Physics = __webpack_require__(6);
	var gameConstants = __webpack_require__(7);
	
	var Runner = function (startingPos) {
	  this.objType = 'runner';
	  this.spriteFrame = 1;
	  this.spriteState = 'stand-right';
	  this.lastSpriteState = 'stand-right';
	  this.lastContactType = '';
	  this.pos = startingPos;
	  this.vel = [0, 0];
	  this.height = 50;
	  this.width = 20;
	  this.spriteFrameCount = {
	    'stand-right': 1,
	    'stand-left': 1,
	    'run-right': 6,
	    'run-left': 6
	  };
	  this.spriteElements = {};
	  this.loadSpriteAssets();
	};
	
	Runner.prototype.loadSpriteAssets = function () {
	  this.spriteElements['stand-right1'] =
	    window.document.getElementById('stand-right1')
	  this.spriteElements['stand-left1'] =
	    window.document.getElementById('stand-left1')
	  this.spriteElements['run-right1'] =
	    window.document.getElementById('run-right1')
	  this.spriteElements['run-right2'] =
	    window.document.getElementById('run-right2')
	  this.spriteElements['run-right3'] =
	    window.document.getElementById('run-right3')
	  this.spriteElements['run-right4'] =
	    window.document.getElementById('run-right4')
	  this.spriteElements['run-right5'] =
	    window.document.getElementById('run-right5')
	  this.spriteElements['run-right6'] =
	    window.document.getElementById('run-right6')
	  this.spriteElements['run-left1'] =
	    window.document.getElementById('run-left1')
	  this.spriteElements['run-left2'] =
	    window.document.getElementById('run-left2')
	  this.spriteElements['run-left3'] =
	    window.document.getElementById('run-left3')
	  this.spriteElements['run-left4'] =
	    window.document.getElementById('run-left4')
	  this.spriteElements['run-left5'] =
	    window.document.getElementById('run-left5')
	  this.spriteElements['run-left6'] =
	    window.document.getElementById('run-left6')
	};
	
	Runner.prototype.draw = function (ctx) {
	  // console.log(this.state);
	  // var sprite;
	  // if (this.spriteState === 'stand-right') {
	  //   sprite = window.document.getElementById('stand-right');
	  // } else if (this.spriteState === 'run-right') {
	  //   sprite = window.document.getElementById('run-right1');
	  // } else if (this.spriteState === 'run-left') {
	  //   sprite = window.document.getElementById('run-left1');
	  // } else {
	  //   // default to stand
	  //   sprite = window.document.getElementById('stand-right');
	  // }
	  var id = this.spriteState + (Math.floor(this.spriteFrame /
	    gameConstants.framesPerSprite) + 1);
	  var sprite = this.spriteElements[id];
	  console.log(id);
	  ctx.drawImage(
	    sprite, this.pos[0], this.pos[1], this.width, this.height
	  );
	};
	
	Runner.prototype.move = function () {
	  // make the movement for this frame based on last frame's
	  // velocity
	  // console.log(this.vel);
	  this.pos = Util.vectorSum(this.pos, this.vel);
	  // then add the constant velocity components for the next frame
	  this.vel = Physics.addGravity(this.vel);
	  this.vel = Physics.addFriction(this.vel);
	  // and determine the state to be in for next frame
	  this.determineState();
	};
	
	Runner.prototype.determineState = function () {
	  // 'stand' or 'collide' at this point may have been previously
	  // set by handleContact
	
	  // if (this.state === 'stand' && this.vel[0] > 0) {
	  //   this.state = 'run-right';
	  // } else if (this.state === 'stand' && this.vel[0] < 0) {
	  //   this.state = 'run-left';
	  // }
	  var newState;
	  if (this.vel[0] > 0) {
	    newState = 'run-right';
	  } else if (this.vel[0] < 0) {
	    newState = 'run-left';
	  } else if (this.vel[0] === 0 &&
	    (this.lastSpriteState === 'run-right' ||
	    this.lastSpriteState === 'stand-right')) {
	    newState = 'stand-right';
	  } else if (this.vel[0] === 0 &&
	    (this.lastSpriteState = 'run-left' ||
	    this.lastSpriteState === 'stand-left')) {
	    newState = 'stand-left';
	  } else {
	    newState = 'stand-right';
	  }
	  if (newState === this.lastSpriteState) {
	    if (this.spriteFrame + 1 < this.spriteFrameCount[newState] *
	      gameConstants.framesPerSprite) {
	      this.spriteFrame = this.spriteFrame + 1;
	    } else {
	      this.spriteFrame = 1;
	    }
	  } else {
	    this.spriteFrame = 1;
	  }
	  this.lastSpriteState = this.spriteState;
	  this.spriteState = newState;
	  // console.log(this.state);
	};
	
	Runner.prototype.handleContact = function (contact) {
	  // handles contact detail object passed from Physics
	  if (contact.contactType === 'stand') {
	    this.standOnPlatform();
	    this.lastContactType = 'stand';
	  }
	  if (contact.contactType === 'collision') {
	    this.collideWithPlatform(contact.stopPos);
	    if (contact.fromDirection === 'above') {
	      this.lastContactType = 'collision';
	    }
	  }
	};
	
	Runner.prototype.standOnPlatform = function () {
	  this.vel = Physics.addNormalForce(this.vel);
	};
	
	Runner.prototype.collideWithPlatform = function (stopPos) {
	  // fully stop (not realistic, but feels less slippery)
	  this.vel = [0, 0];
	  this.pos = stopPos;
	};
	
	Runner.prototype.runAccelerate = function (dir) {
	  var sign;
	  if (dir === 'left') {
	    sign = -1;
	  } else if (dir === 'right') {
	    sign = 1;
	  }
	  // first ensure running is always equal to friction, to allow
	  // maintaining velocity
	  var runAccel = [sign * gameConstants.friction, 0];
	  // if velocity is less than max run velocity, add extra
	  // term beyond overcoming friction to allow acceleration
	  if ((dir === 'left' && this.vel[0] >= -(gameConstants.maxRunVel)) ||
	    (dir === 'right' && this.vel[0] <= gameConstants.maxRunVel)) {
	    // if adding the full extra acceleration would put the runner
	    // past max speed, only add the difference
	    var speedDelta = gameConstants.maxRunVel - Math.abs(this.vel[0]);
	    var accel = Math.min(speedDelta, gameConstants.runAccel);
	    var extraAccel = [sign * accel, 0];
	    runAccel = Util.vectorSum(runAccel, extraAccel);
	  }
	  this.vel = Util.vectorSum(this.vel, runAccel);
	};
	
	Runner.prototype.jump = function () {
	  // jumpAccel = [0, -(gameConstants.jumpAccel)];
	  // this.vel = Util.vectorSum(this.vel, jumpAccel);
	  this.vel = [this.vel[0], -(gameConstants.jumpAccel)];
	};
	
	module.exports = Runner;


/***/ },
/* 5 */
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
	  },
	
	  isBetween: function(num, lowerBound, upperBound, inclusive) {
	    if (typeof inclusive === 'undefined') {
	      inclusive = true;
	    }
	    if (inclusive) {
	      return num >= lowerBound && num <= upperBound;
	    } else {
	      return num > lowerBound && num < upperBound;
	    }
	  }
	
	};
	
	module.exports = Util;


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	// for dealing with gravity and collisions
	
	var gameConstants = __webpack_require__(7);
	var Util = __webpack_require__(5);
	
	var Physics = {
	
	  addGravity: function (vel) {
	    var gravityVector = [0, gameConstants.gravity];
	    return Util.vectorSum(vel, gravityVector);
	  },
	
	  addNormalForce: function (vel) {
	    var normalForceVector = [0, -(gameConstants.gravity)];
	    return Util.vectorSum(vel, normalForceVector);
	  },
	
	  addFriction: function (vel) {
	    // if addition of friction would reverse the velocity
	    // vector, just return 0 horizontal velocity
	    if (Math.abs(vel[0]) <= gameConstants.friction) {
	      return [0, vel[1]];
	    } else {
	      var friction = -(Math.sign(vel[0])) * gameConstants.friction;
	      var frictionVector = [friction, 0];
	      return Util.vectorSum(vel, frictionVector);
	    }
	  },
	
	  detectContact: function (objA, objB) {
	    // if there is contact, returns an object containing
	    // information on the contact
	    // otherwise returns null
	
	    // set up variable aliases for easier reading
	    var objALeft = objA.pos[0];
	    var objARight = objA.pos[0] + objA.width;
	    var objATop = objA.pos[1];
	    var objABottom = objA.pos[1] + objA.height;
	    var objAVertVel = objA.vel[1];
	    var objBLeft = objB.pos[0];
	    var objBRight = objB.pos[0] + objB.width;
	    var objBTop = objB.pos[1];
	    var objBBottom = objB.pos[1] + objB.height;
	
	    if (Util.isBetween(objABottom, objBTop, objBBottom) &&
	      (Util.isBetween(objARight, objBLeft, objBRight) ||
	      Util.isBetween(objALeft, objBLeft, objBRight))) {
	      // objA hits objB from above
	      // if objA velocity is only equal to gravity,
	      // objA is standing on objB
	      if (objAVertVel === gameConstants.gravity) {
	        return {
	          contactType: 'stand'
	        };
	      } else if (objAVertVel > 0) {
	        return {
	          contactType: 'collision',
	          fromDirection: 'above',
	          stopPos: [objALeft, objBTop - objA.height]
	        };
	      }
	
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
	
	  framesPerSprite: 5,
	
	  gravity: 0.4,
	
	  maxRunVel: 7,
	
	  runAccel: 2,
	
	  jumpAccel: 10,
	
	  friction: 2,
	
	  scrollSpeed: 6,
	
	  platformMinHeight: 20,
	
	  platformAddHeight: 30,
	
	  platformMinWidth: 75,
	
	  platformAddWidth: 300,
	
	  jumpMaxMagnitude: 300
	
	};
	
	module.exports = gameConstants;


/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	// manages generation and storage of environment objects
	
	var gameConstants = __webpack_require__(7);
	var Platform = __webpack_require__(3);
	
	var LevelGenerator = function (game) {
	  this.game = game;
	  this.platforms = [];
	  this.nextVerticalPos = 0;
	  this.nextGap = 0;
	  this.lastPlatform = null;
	  this.setFirstPlatform();
	  this.setNextValues();
	};
	
	LevelGenerator.prototype.randPlatformHeight = function () {
	  return gameConstants.platformMinHeight +
	    Math.round(gameConstants.platformAddHeight * Math.random());
	};
	
	LevelGenerator.prototype.randPlatformWidth = function () {
	  return gameConstants.platformMinWidth +
	    Math.round(gameConstants.platformAddWidth * Math.random());
	};
	
	LevelGenerator.prototype.setFirstPlatform = function () {
	  // guarantee first platform is always in the same position
	  var firstPlatform = new Platform([100, 400], 30, 150);
	  // also set it as last platform so next numbers can refer
	  // to it
	  this.lastPlatform = firstPlatform;
	  this.platforms.push(firstPlatform);
	};
	
	LevelGenerator.prototype.lastPlatformTop = function () {
	  if (this.lastPlatform) {
	    return this.lastPlatform.pos[1];
	  }
	};
	
	LevelGenerator.prototype.lastPlatformEdge = function () {
	  if (this.lastPlatform) {
	    return this.lastPlatform.pos[0] + this.lastPlatform.width;
	  }
	};
	
	LevelGenerator.prototype.setNextValues = function () {
	  this.nextVerticalPos = this.platformVerticalPos();
	  this.nextGap = this.platformGap();
	};
	
	LevelGenerator.prototype.platformVerticalPos = function () {
	  // platform must be within band of 60 pixels from either
	  // top or bottom of the screen, as well as at least 10 pixels
	  // less than the previous platform top plus the max
	  // jump magnitude
	  // remember, y-offset is from the top so everything is backwards
	  var forceBottom = this.game.frameHeight - 60;
	  var forceTop = 60;
	  var jumpTop = this.lastPlatformTop() -
	    gameConstants.jumpMaxMagnitude + 10;
	  var top = Math.max(forceTop, jumpTop);
	  var heightBand = forceBottom - top;
	  return top + Math.round(heightBand * Math.random());
	};
	
	LevelGenerator.prototype.platformGap = function () {
	  // ensure that absolute distance to next platform is valid
	  // (i.e. high platforms aren't far, far platforms aren't
	  // high)
	  var verticalGap = this.lastPlatformTop() - this.nextVerticalPos;
	  var maxGap;
	  if (verticalGap > 0) {
	    maxGap = Math.round(
	      Math.sqrt(
	        Math.pow(gameConstants.jumpMaxMagnitude, 2) -
	        Math.pow(verticalGap, 2)
	      )
	    );
	  } else {
	    maxGap = Math.round(
	      Math.sqrt(Math.pow(gameConstants.jumpMaxMagnitude, 2) / 2)
	    );
	  }
	
	  return maxGap;
	
	
	  // return Math.round(maxGap / 2) + Math.round((maxGap / 2) *
	  // Math.random());
	};
	
	LevelGenerator.prototype.checkAndAddPlatform = function () {
	  // check on each frame, and when the next platform to be drawn
	  // is about to come on the screen, generate it and pick the
	  // next numbers
	  if (this.lastPlatformEdge() + this.nextGap <
	    this.game.frameWidth + 2) {
	    var height = this.randPlatformHeight();
	    var width = this.randPlatformWidth();
	    var verticalPos = this.nextVerticalPos;
	    var horizontalPos = this.game.frameWidth + 1;
	    var newPlatform = new Platform([horizontalPos, verticalPos],
	      height, width);
	    // set it as last platform and select the numbers for
	    // the next one to be generated
	    this.lastPlatform = newPlatform;
	    this.platforms.push(newPlatform);
	    this.setNextValues();
	  }
	};
	
	module.exports = LevelGenerator;


/***/ },
/* 9 */
/***/ function(module, exports) {

	// handles game's interaction wtih canvas element
	
	var GameView = function (game, ctx) {
	  this.game = game;
	  this.ctx = ctx;
	};
	
	GameView.prototype.drawFrameAndLoop = function () {
	  window.requestAnimationFrame(function () {
	    this.generateFrame();
	  }.bind(this))
	}
	
	GameView.prototype.generateFrame = function () {
	  this.ctx.clearRect(0, 0, this.game.frameWidth, this.game.frameHeight)
	  this.game.draw(this.ctx);
	  this.game.advanceFrame();
	  this.drawFrameAndLoop();
	};
	
	module.exports = GameView;


/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map