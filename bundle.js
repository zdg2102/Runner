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
	var GameView = __webpack_require__(12);
	
	window.document.addEventListener('DOMContentLoaded', function () {
	  var canvas = window.document.getElementById('canvas');
	  var ctx = canvas.getContext('2d');
	  ctx.canvas.height = 650;
	  ctx.canvas.width = 1000;
	  var game = new RunnerGame(ctx.canvas.height, ctx.canvas.width);
	  var gameView = new GameView(game, ctx);
	  gameView.drawFrameAndLoop();
	});


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	// main game file
	
	var GameControls = __webpack_require__(2);
	var Platform = __webpack_require__(3);
	var Runner = __webpack_require__(5);
	var Util = __webpack_require__(6);
	var Physics = __webpack_require__(7);
	var gameConstants = __webpack_require__(4);
	var LevelGenerator = __webpack_require__(9);
	var BackgroundGenerator = __webpack_require__(10);
	var Screens = __webpack_require__(13);
	
	var RunnerGame = function (frameHeight, frameWidth) {
	  this.frameHeight = frameHeight;
	  this.frameWidth = frameWidth;
	  this.levelGenerator = new LevelGenerator(this);
	  this.platforms = this.levelGenerator.platforms;
	  this.backgroundGenerator = new BackgroundGenerator(this);
	  this.backgroundObjects = this.backgroundGenerator.backgroundObjects;
	  this.screens = new Screens(this);
	  this.runner = new Runner([320, 350]);
	  this.runnerDistance = 0;
	  this.isPaused = false;
	  this.isInIntro = true;
	  this.isRunnerDead = false;
	  GameControls.bindKeyHandlers(this, this.runner);
	};
	
	RunnerGame.prototype.allObjects = function () {
	  // background objects are added first so everything
	  // else is drawn on top of them
	  return this.backgroundObjects.concat(this.platforms)
	    .concat([this.runner]);
	};
	
	RunnerGame.prototype.foregroundObjects = function () {
	  return this.platforms.concat([this.runner]);
	};
	
	RunnerGame.prototype.environmentObjects = function () {
	  return this.platforms.slice();
	};
	
	RunnerGame.prototype.draw = function (ctx) {
	  ctx.fillStyle = 'rgb(139, 162, 185)';
	  // ctx.fillStyle = 'rgb(159, 182, 205)';
	  ctx.fillRect(0, 0, this.frameWidth, this.frameHeight);
	  this.allObjects().forEach(function (obj) {
	    obj.draw.call(obj, ctx);
	  });
	  if (!this.isInIntro) {
	    this.screens.displayScore(ctx);
	  }
	  // // draw pause overlay if game is paused
	  if (this.isPaused) {
	    this.screens.displayPause(ctx);
	  }
	  if (this.isInIntro) {
	    this.screens.displayTitleScreen(ctx);
	  }
	  if (this.isRunnerDead) {
	    this.screens.displayDeath(ctx);
	  }
	};
	
	RunnerGame.prototype.closeInfoScreen = function () {
	  if (!this.isRunnerDead) {
	    // in this case we're closing the intro screen
	    this.isInIntro = false;
	  } else {
	    // otherwise we're resetting the game
	    this.reset();
	  }
	};
	
	RunnerGame.prototype.reset = function () {
	  this.isRunnerDead = false;
	  this.isInIntro = true;
	  this.runner.pos = [320, 350];
	  this.runner.vel = [0, 0];
	  this.runner.width = 20;
	  this.runner.height = 50;
	  this.runner.frameState = 'stand-right';
	  this.runner.runnerAnimator.spriteFrame = 1;
	  this.levelGenerator = new LevelGenerator(this);
	  this.platforms = this.levelGenerator.platforms;
	  this.backgroundGenerator = new BackgroundGenerator(this);
	  this.backgroundObjects = this.backgroundGenerator.backgroundObjects;
	  this.runnerDistance = 0;
	};
	
	RunnerGame.prototype.togglePause = function () {
	  this.isPaused = !this.isPaused;
	};
	
	RunnerGame.prototype.advanceFrame = function () {
	  // if (!this.isPaused) {
	   if (!this.isPaused && !this.isInIntro && !this.isRunnerDead) {
	    GameControls.checkHeldKeys(this.runner);
	    this.checkRunnerDeath();
	    this.checkRunnerContact();
	    this.runner.move();
	    this.scroll();
	    this.levelGenerator.checkAndAddPlatform();
	    this.backgroundGenerator.checkAndAddBuilding();
	    this.levelGenerator.checkAndClearOffscreenPlatform();
	    this.backgroundGenerator.checkAndClearOffscreenBuilding();
	  }
	};
	
	RunnerGame.prototype.scroll = function () {
	  var scrollMovement = [-(gameConstants.scrollSpeed), 0];
	  var parallaxScrollMovement = [
	    -(gameConstants.scrollSpeed * gameConstants.parallaxFactor),
	    0
	  ];
	  this.foregroundObjects().forEach(function (obj) {
	    obj.pos = Util.vectorSum(obj.pos, scrollMovement);
	  });
	  this.backgroundObjects.forEach(function (obj) {
	    obj.pos = Util.vectorSum(obj.pos, parallaxScrollMovement);
	  });
	  this.runnerDistance += gameConstants.scrollSpeed;
	};
	
	RunnerGame.prototype.checkRunnerContact = function () {
	  // determine if the runner is in contact with any
	  // environment objects
	  this.environmentObjects().forEach(function (obj) {
	    var contact = Physics.detectContact(this.runner, obj);
	    if (contact) {
	      this.runner.handleContact(contact);
	    }
	  }.bind(this));
	};
	
	RunnerGame.prototype.checkRunnerDeath = function () {
	  // determine if the runner died
	  // going off the top of the screen won't kill you
	  if (this.runner.pos[0] > this.frameWidth ||
	    this.runner.pos[0] + this.runner.width < 0 ||
	    this.runner.pos[1] > this.frameHeight) {
	    this.isRunnerDead = true;
	  }
	};
	
	module.exports = RunnerGame;


/***/ },
/* 2 */
/***/ function(module, exports) {

	// handles user input (using Keymaster library via global 'key')
	
	var GameControls = {
	
	  bindKeyHandlers: function (game, runner) {
	    key('up', function () {
	      runner.jump();
	    });
	    key('w', function () {
	      runner.jump();
	    });
	    key('p', function () {
	      game.togglePause();
	    });
	    key('return', function () {
	      game.closeInfoScreen();
	    });
	  },
	
	  checkHeldKeys: function (runner) {
	    if (key.isPressed('left')) {
	      runner.runAccelerate('left');
	    } else if (key.isPressed('right')) {
	      runner.runAccelerate('right');
	    } else if (key.isPressed('a')) {
	      runner.runAccelerate('left');
	    } else if (key.isPressed('d')) {
	      runner.runAccelerate('right');
	    }
	  }
	
	};
	
	module.exports = GameControls;


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	// basic platform for running and jumping on
	
	var gameConstants = __webpack_require__(4);
	
	var Platform = function (pos, height, width) {
	  this.pos = pos;
	  this.height = height;
	  this.width = width;
	};
	
	Platform.prototype.draw = function (ctx) {
	  ctx.fillStyle = 'rgb(96, 88, 119)';
	  ctx.fillRect(this.pos[0], this.pos[1], this.width, this.height);
	  ctx.beginPath();
	  ctx.strokeStyle = 'rgb(0, 0, 0)';
	  ctx.lineWidth = gameConstants.platformOutlineThickness;
	  ctx.strokeRect(
	    this.pos[0],
	    this.pos[1] + Math.round(gameConstants.platformOutlineThickness / 2),
	    this.width,
	    this.height - Math.round(gameConstants.platformOutlineThickness / 2)
	  );
	};
	
	module.exports = Platform;


/***/ },
/* 4 */
/***/ function(module, exports) {

	// all constants, to allow for easier adjustments
	
	var gameConstants = {
	
	  framesPerSprite: 5,
	
	  gravity: 0.4,
	
	  maxRunVel: 10,
	
	  runAccel: 2,
	
	  jumpVel: 10,
	
	  friction: 2,
	
	  scrollSpeed: 8,
	
	  parallaxFactor: 0.3,
	
	  platformMinHeight: 20,
	
	  platformAddHeight: 30,
	
	  platformMinWidth: 75,
	
	  platformAddWidth: 300,
	
	  platformOutlineThickness: 5,
	
	  buildingMinWidth: 150,
	
	  buildingAddWidth: 50,
	
	  jumpMaxMagnitude: 250,
	
	  numJumps: 2
	
	};
	
	module.exports = gameConstants;


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	// the player-controlled character
	
	var Util = __webpack_require__(6);
	var Physics = __webpack_require__(7);
	var gameConstants = __webpack_require__(4);
	var RunnerAnimator = __webpack_require__(8);
	
	var Runner = function (startingPos) {
	  this.pos = startingPos;
	  this.vel = [0, 0];
	  this.frameState = 'stand-right';
	  this.prevFrameState = 'stand-right';
	  this.lastContactType = 'stand';
	  this.jumpsRemaining = gameConstants.numJumps;
	  this.height = 50;
	  this.width = 20;
	  this.collideHeight = 50;
	  this.collideWidth = 20;
	  this.runnerAnimator = new RunnerAnimator(this);
	};
	
	Runner.prototype.draw = function (ctx) {
	  // delegates to RunnerAnimator
	  this.runnerAnimator.draw(ctx);
	};
	
	Runner.prototype.move = function () {
	  // make the movement for this frame based on last frame's
	  // velocity
	  this.pos = Util.vectorSum(this.pos, this.vel);
	  // then add the constant velocity components for the next frame
	  this.vel = Physics.addGravity(this.vel);
	  this.vel = Physics.addFriction(this.vel);
	  // and determine the state to start the next frame
	  this.determineState();
	};
	
	Runner.prototype.determineState = function () {
	  // uses previous state, previous contact type, and
	  // current velocity to determine current runner state
	
	  var newState;
	  if (this.vel[1] > 1 && this.vel[0] >= 0) {
	    newState = 'flip-right';
	  } else if (this.vel[1] > 1 && this.vel[0] < 0) {
	    newState = 'flip-left';
	  } else if (this.vel[0] > 0) {
	    newState = 'run-right';
	  } else if (this.vel[0] < 0) {
	    newState = 'run-left';
	  } else if (this.vel[0] === 0 &&
	    (this.prevFrameState === 'run-right' ||
	    this.prevFrameState === 'stand-right' ||
	    this.prevFrameState === 'flip-right')) {
	    newState = 'stand-right';
	  } else if (this.vel[0] === 0 &&
	    (this.prevFrameState === 'run-left' ||
	    this.prevFrameState === 'stand-left' ||
	    this.prevFrameState === 'flip-left')) {
	    newState = 'stand-left';
	  } else {
	    newState = 'stand-right';
	  }
	
	  // uses state to set sprite
	  this.runnerAnimator.setSprite(newState);
	
	  // also control for size
	  if (newState === 'flip-right' ||
	  newState === 'flip-left') {
	    this.height = 40;
	    this.width = 40;
	  } else {
	    this.height = 50;
	    this.width = 20;
	  }
	
	  this.prevFrameState = this.frameState;
	  this.frameState = newState;
	
	};
	
	Runner.prototype.handleContact = function (contact) {
	  // handles contact detail object passed from Physics
	  if (contact.contactType === 'stand') {
	    this.jumpsRemaining = gameConstants.numJumps;
	    this.standOnPlatform();
	    this.lastContactType = 'stand';
	  }
	  if (contact.contactType === 'collision') {
	    this.jumpsRemaining = gameConstants.numJumps;
	    this.collideWithPlatform(contact.stopPos);
	    if (contact.fromDirection === 'above') {
	      this.lastContactType = 'collision';
	    }
	  }
	  if (contact.contactType === 'stick') {
	    this.jumpsRemaining = gameConstants.numJumps;
	    // this.stickToWall(); not written yet
	    this.lastContactType = 'stick';
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
	
	  if (!(Math.sign(this.vel[0]) === sign &&
	    Math.abs(this.vel[0]) > gameConstants.maxRunVel)) {
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
	  if (this.jumpsRemaining > 0) {
	    // change vertical velocity immediately to jump velocity
	    // regardless of previous velocity (otherwise double jumps
	    // feel weak)
	    this.vel = [this.vel[0], -(gameConstants.jumpVel)];
	    this.jumpsRemaining -= 1;
	  }
	};
	
	module.exports = Runner;


/***/ },
/* 6 */
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
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	// for dealing with gravity, friction, collisions, and contact
	
	var gameConstants = __webpack_require__(4);
	var Util = __webpack_require__(6);
	
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
	
	  handleTopContact: function (movingObj, stopPos) {
	    // if the only vertical velocity is gravity,
	    // movingObject is standing on top of other object
	    // console.log(movingObj.vel[1])
	    if (movingObj.vel[1] === gameConstants.gravity) {
	      return {
	        contactType: 'stand'
	      };
	    } else if (movingObj.vel[1] > 0) {
	      return {
	        contactType: 'collision',
	        fromDirection: 'above',
	        stopPos: stopPos
	      };
	    }
	  },
	
	  handleLeftContact: function (movingObj, stopPos) {
	    // if the only vertical velocity is gravity,
	    // movingObject is stuck to the side of the other
	    // object
	    if (movingObj.vel[1] === gameConstants.gravity) {
	      return {
	        contactType: 'stick'
	      };
	    } else if (movingObj.vel[0] > 0) {
	      return {
	        contactType: 'collision',
	        fromDirection: 'left',
	        stopPos: stopPos
	      };
	    }
	  },
	
	  handleRightContact: function (movingObj, stopPos) {
	    // if the only vertical velocity is gravity,
	    // movingObject is stuck to the side of the other
	    // object
	    if (movingObj.vel[1] === gameConstants.gravity) {
	      return {
	        contactType: 'stick'
	      };
	    } else if (movingObj.vel[0] < 0) {
	      return {
	        contactType: 'collision',
	        fromDirection: 'right',
	        stopPos: stopPos
	      };
	    }
	  },
	
	  handleBottomContact: function (movingObj, stopPos) {
	    if (movingObj.vel[1] < 0) {
	      return {
	        contactType: 'collision',
	        fromDirection: 'bottom',
	        stopPos: stopPos
	      };
	    }
	  },
	
	  determineCrossing: function (nowX, nowY, velX, velY, surfaceX,
	    surfaceXTop, surfaceXBottom, surfaceY, surfaceYLeft,
	    surfaceYRight) {
	    // projects velocity backwards to determine
	    // which surface was crossed
	    // first determines what scaling factors would be required
	    // to cross both the surfaceX and surfaceY planes
	    var scalingY = Math.round((nowY - surfaceY) / velY);
	    var scalingX = Math.round((nowX - surfaceX) / velX);
	    var projectedX = nowX - (scalingY * velX);
	    var projectedY = nowY - (scalingX * velY);
	    // a crossing is invalid if the scaling is negative
	    // (which means the vector is pointed the wrong way),
	    // greater than one (which means the collision could
	    // not have happened within the last frame), or
	    // if the projected other point is not within
	    // the allowed bounds
	    if (scalingY < 0 || scalingY > 1 ||
	      !Util.isBetween(projectedX, surfaceYLeft, surfaceYRight)) {
	      scalingY = null;
	    }
	    if (scalingX < 0 || scalingX > 1 ||
	      !Util.isBetween(projectedY, surfaceXTop, surfaceXBottom)) {
	      scalingX = null;
	    }
	    // need to include additional checks for zero to avoid
	    // evaluating them as false
	    if ((scalingY || scalingY === 0) &&
	      (scalingX || scalingX === 0)) {
	      // should very rarely occur, but defaults in favor
	      // of top
	      return {
	        surface: 'y',
	        contactPos: [projectedX, surfaceY]
	      };
	    } else if ((scalingY || scalingY === 0)) {
	      return {
	        surface: 'y',
	        contactPos: [projectedX, surfaceY]
	      };
	    } else if ((scalingX || scalingX === 0)) {
	      return {
	        surface: 'x',
	        contactPos: [surfaceX, projectedY]
	      };
	    } else {
	      return null;
	    }
	
	  },
	
	  detectContact: function (objA, objB) {
	    // if there is contact, returns an object containing
	    // information on the contact
	    // otherwise returns null
	
	    // set up variable aliases for easier reading
	    // need to account for the runner's relevant
	    // height having a different name
	    var aHeight = objA.collideHeight || objA.height;
	    var aWidth = objA.collideWidth || objA.width;
	    var bHeight = objB.collideHeight || objB.height;
	    var bWidth = objB.collideWidth || objB.width;
	    var objALeft = objA.pos[0];
	    var objARight = objA.pos[0] + aWidth;
	    var objATop = objA.pos[1];
	    var objABottom = objA.pos[1] + aHeight;
	    var objBLeft = objB.pos[0];
	    var objBRight = objB.pos[0] + bWidth;
	    var objBTop = objB.pos[1];
	    var objBBottom = objB.pos[1] + bHeight;
	
	    var contactInfo, contactSurface, contactPos;
	
	    // checks whether any corner has passed into or through
	    // the other object
	    if (objABottom >= objBTop && objARight >= objBLeft) {
	      // this means objA's bottom-right corner is past
	      // the top or left of objB, so collision needs
	      // to be checked
	      contactInfo = this.determineCrossing(
	        objARight, objABottom, objA.vel[0], objA.vel[1],
	        objBLeft, objBTop, objBBottom, objBTop, objBLeft,
	        objBRight
	      );
	      if (contactInfo && contactInfo.surface === 'y') {
	        contactInfo.surface = 'top';
	        contactInfo.stopPos = [contactInfo.contactPos[0] - aWidth,
	        objBTop - aHeight];
	      } else if (contactInfo && contactInfo.surface === 'x') {
	        contactInfo.surface = 'left';
	        contactInfo.stopPos = [objBLeft - aWidth,
	        contactInfo.contactPos[1] - aHeight];
	      }
	    }
	    if (!contactInfo && objABottom >= objBTop &&
	      objALeft <= objBRight) {
	      // collision on objA's bottom-left corner
	      contactInfo = this.determineCrossing(
	        objALeft, objABottom, objA.vel[0], objA.vel[1],
	        objBRight, objBTop, objBBottom, objBTop, objBLeft,
	        objBRight
	      );
	      if (contactInfo && contactInfo.surface === 'y') {
	        contactInfo.surface = 'top';
	        contactInfo.stopPos = [contactInfo.contactPos[0],
	        objBTop - aHeight];
	      } else if (contactInfo && contactInfo.surface === 'x') {
	        contactInfo.surface = 'right';
	        contactInfo.stopPos = [objBRight,
	        contactInfo.contactPos[1] - aHeight];
	      }
	    }
	    if (!contactInfo && objATop <= objBBottom &&
	      objARight >= objBLeft) {
	      // collision on objA's top-right corner
	      contactInfo = this.determineCrossing(
	        objARight, objATop, objA.vel[0], objA.vel[1],
	        objBLeft, objBTop, objBBottom, objBBottom, objBLeft,
	        objBRight
	      );
	      if (contactInfo && contactInfo.surface === 'y') {
	        contactInfo.surface = 'bottom';
	        contactInfo.stopPos = [contactInfo.contactPos[0] - aWidth,
	        objBBottom];
	      } else if (contactInfo && contactInfo.surface === 'x') {
	        contactInfo.surface = 'left';
	        contactInfo.stopPos = [objBLeft,
	        contactInfo.contactPos[1]];
	      }
	    }
	    if (!contactInfo && objATop <= objBBottom &&
	      objALeft <= objBRight) {
	      // collision on objA's top-left corner
	      contactInfo = this.determineCrossing(
	        objALeft, objATop, objA.vel[0], objA.vel[1],
	        objBRight, objBTop, objBBottom, objBBottom, objBLeft,
	        objBRight
	      );
	      if (contactInfo && contactInfo.surface === 'y') {
	        contactInfo.surface = 'bottom';
	        contactInfo.stopPos = [contactInfo.contactPos[0],
	        objBBottom];
	      } else if (contactInfo && contactInfo.surface === 'x') {
	        contactInfo.surface = 'right';
	        contactInfo.stopPos = [objBRight,
	        contactInfo.contactPos[1]];
	      }
	    }
	
	    if (contactInfo) {
	      contactSurface = contactInfo.surface;
	      stopPos = contactInfo.stopPos;
	
	      if (contactSurface === 'top') {
	        return this.handleTopContact(objA, stopPos);
	      } else if (contactSurface === 'left') {
	        return this.handleLeftContact(objA, stopPos);
	      } else if (contactSurface === 'right') {
	        return this.handleRightContact(objA, stopPos);
	      } else if (contactSurface === 'bottom') {
	        return this.handleBottomContact(objA, stopPos);
	      }
	    } else {
	      return null;
	    }
	  }
	
	};
	
	module.exports = Physics;


/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	// controls animation of runner sprite
	
	var gameConstants = __webpack_require__(4);
	
	var RunnerAnimator = function (runner) {
	  this.runner = runner;
	  this.spriteAssets = {};
	  this.spriteFrame = 1;
	  this.spriteFrameCount = {
	    'stand-right': 1,
	    'stand-left': 1,
	    'run-right': 6,
	    'run-left': 6,
	    'flip-right': 6,
	    'flip-left': 6
	  };
	  this.loadSpriteAssets();
	};
	
	RunnerAnimator.prototype.loadSpriteAssets = function () {
	  var spriteIds = ['stand-right1', 'stand-left1', 'run-right1',
	    'run-right2', 'run-right3', 'run-right4', 'run-right5',
	    'run-right6', 'run-left1', 'run-left2', 'run-left3',
	    'run-left4', 'run-left5', 'run-left6', 'flip-right1', 'flip-right2',
	    'flip-right3', 'flip-right4', 'flip-right5', 'flip-right6',
	    'flip-left1', 'flip-left2', 'flip-left3', 'flip-left4',
	    'flip-left5', 'flip-left6'];
	  spriteIds.forEach(function (id) {
	    this.spriteAssets[id] = window.document.getElementById(id);
	  }.bind(this));
	};
	
	RunnerAnimator.prototype.draw = function (ctx) {
	  // draw frame for debugging
	  // ctx.fillStyle = 'blue';
	  // ctx.fillRect(this.runner.pos[0], this.runner.pos[1],
	  //   this.runner.width, this.runner.height);
	
	  var id = this.runner.frameState + (Math.floor(this.spriteFrame /
	    gameConstants.framesPerSprite) + 1);
	  var sprite = this.spriteAssets[id];
	  ctx.drawImage(
	    sprite, this.runner.pos[0], this.runner.pos[1], this.runner.width,
	      this.runner.height
	  );
	};
	
	RunnerAnimator.prototype.setSprite = function (newState) {
	  if (newState === this.runner.prevFrameState) {
	    if (this.spriteFrame + 1 < this.spriteFrameCount[newState] *
	      gameConstants.framesPerSprite) {
	      this.spriteFrame = this.spriteFrame + 1;
	    } else {
	      this.spriteFrame = 1;
	    }
	  } else {
	    this.spriteFrame = 1;
	  }
	};
	
	module.exports = RunnerAnimator;


/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	// manages generation and storage of environment objects
	
	var gameConstants = __webpack_require__(4);
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
	  var firstPlatform = new Platform([300, 400], 30, 300);
	  // var firstPlatform = new Platform([100, 600], 30, 300);
	  // also set it as last platform so next numbers can refer
	  // to it
	  this.lastPlatform = firstPlatform;
	  this.platforms.push(firstPlatform);
	
	  // var testBrick = new Platform([500, 200], 150, 150);
	  // this.platforms.push(testBrick);
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
	
	LevelGenerator.prototype.checkAndClearOffscreenPlatform = function () {
	  // see if a platform has cleared the screen and delete it
	  for (var i = 0; i < this.platforms.length; i++) {
	    if (this.platforms[i].pos[0] + this.platforms[i].width < 0) {
	      this.platforms.splice(i, 1);
	      return;
	    }
	  }
	
	};
	
	module.exports = LevelGenerator;


/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	// for filling the background
	
	var Building = __webpack_require__(11);
	var gameConstants = __webpack_require__(4);
	
	var BackgroundGenerator = function (game) {
	  this.game = game;
	  this.backgroundObjects = [];
	  this.lastObject = null;
	  this.buildingHeight = this.game.frameHeight;
	  this.populateInitialScreen();
	};
	
	BackgroundGenerator.prototype.populateInitialScreen = function () {
	  var width = Math.round(gameConstants.buildingMinWidth +
	    Math.random() * gameConstants.buildingAddWidth);
	  var left = -Math.round(width / 3);
	  var building;
	  while (left < this.game.frameWidth) {
	    var top = Math.round(Math.random() * (this.game.frameHeight * 0.7));
	    building = new Building([left, top],
	      width, this.buildingHeight, this.game);
	    this.backgroundObjects.push(building);
	    left += width;
	    width = Math.round(gameConstants.buildingMinWidth +
	      Math.random() * gameConstants.buildingAddWidth);
	  }
	  this.lastObject = building;
	};
	
	BackgroundGenerator.prototype.checkAndAddBuilding = function () {
	  if (this.lastObject.pos[0] + this.lastObject.width <
	    this.game.frameWidth + 2) {
	    var width = Math.round(gameConstants.buildingMinWidth +
	      Math.random() * gameConstants.buildingAddWidth);
	    var left = this.lastObject.pos[0] + this.lastObject.width;
	    var top = Math.round(Math.random() * (this.game.frameHeight / 3));
	    var building = new Building([left, top],
	      width, this.buildingHeight, this.game);
	    this.backgroundObjects.push(building);
	    this.lastObject = building;
	  }
	};
	
	BackgroundGenerator.prototype.checkAndClearOffscreenBuilding =
	  function () {
	  // see if a building has cleared the screen and delete it
	  for (var i = 0; i < this.backgroundObjects.length; i++) {
	    if (this.backgroundObjects[i].pos[0] +
	      this.backgroundObjects[i].width < 0) {
	      this.backgroundObjects.splice(i, 1);
	      return;
	    }
	  }
	
	};
	
	module.exports = BackgroundGenerator;


/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	// building outline for background fill
	
	var gameConstants = __webpack_require__(4);
	
	var Building = function (pos, width, height, game) {
	  this.pos = pos;
	  this.height = height;
	  this.width = width;
	  this.game = game;
	  this.r = 0;
	  this.g = 0;
	  this.b = 0;
	  if (this.pos[1] > 120 && Math.random() < 0.15) {
	    this.buildingType = 'right-slope';
	  } else if (this.pos[1] > 120 && Math.random() < 0.15) {
	    this.buildingType = 'left-slope';
	  } else if (this.pos[1] > 120 && Math.random() < 0.15) {
	    this.buildingType = 'pyramid';
	  }
	  this.windowSpacing = Math.round((this.width - 40) / 3);
	  this.setColor();
	};
	
	Building.prototype.setColor = function () {
	  // every fifth building or so make a gap
	  if (Math.random() < 0.2) {
	    this.r = null;
	    this.g = null;
	    this.b = null;
	  } else {
	    this.r = Math.round(160 + Math.random() * 20);
	    this.g = Math.round(160 + Math.random() * 20);
	    this.b = Math.round(160 + Math.random() * 20);
	  }
	};
	
	Building.prototype.draw = function (ctx) {
	  // draw nothing if the color values are null
	  if (this.r && this.g && this.b) {
	    ctx.fillStyle = 'rgb(' + this.r + ',' + this.g + ',' + this.b + ')';
	    ctx.fillRect(this.pos[0], this.pos[1], this.width, this.height);
	    this.addWindows(ctx);
	    if (this.buildingType === 'right-slope') {
	      this.addRightSlopeRoof(ctx);
	    } else if (this.buildingType === 'left-slope') {
	      this.addLeftSlopeRoof(ctx);
	    } else if (this.buildingType === 'pyramid') {
	      this.addPyramidRoof(ctx);
	    }
	  }
	};
	
	Building.prototype.addWindows = function (ctx) {
	  var windowWidth = 10;
	  var windowHeight = 30;
	  var top = this.pos[1] + 40;
	  var left = this.pos[0] + this.windowSpacing;
	  ctx.fillStyle = 'rgb(230, 230, 230)';
	  while (top < this.game.frameHeight) {
	    while (left + windowWidth < this.pos[0] + this.width) {
	      ctx.fillRect(left, top, windowWidth, windowHeight);
	      left += this.windowSpacing;
	    }
	    top += 70;
	    left = this.pos[0] + this.windowSpacing;
	  }
	};
	
	Building.prototype.addRightSlopeRoof = function (ctx) {
	  ctx.fillStyle = 'rgb(' + this.r + ',' + this.g + ',' + this.b + ')';
	  ctx.beginPath();
	  ctx.moveTo(this.pos[0], this.pos[1]);
	  ctx.lineTo(this.pos[0] + this.width, this.pos[1] - 100);
	  ctx.lineTo(this.pos[0] + this.width, this.pos[1] + 3);
	  ctx.fill();
	};
	
	Building.prototype.addLeftSlopeRoof = function (ctx) {
	  ctx.fillStyle = 'rgb(' + this.r + ',' + this.g + ',' + this.b + ')';
	  ctx.beginPath();
	  ctx.moveTo(this.pos[0] + this.width, this.pos[1]);
	  ctx.lineTo(this.pos[0], this.pos[1] - 100);
	  ctx.lineTo(this.pos[0], this.pos[1] + 3);
	  ctx.fill();
	};
	
	Building.prototype.addPyramidRoof = function (ctx) {
	  ctx.fillStyle = 'rgb(' + this.r + ',' + this.g + ',' + this.b + ')';
	  ctx.beginPath();
	  ctx.moveTo(this.pos[0], this.pos[1]);
	  ctx.lineTo(this.pos[0] + Math.round(this.width / 2), this.pos[1] - 100);
	  ctx.lineTo(this.pos[0] + this.width, this.pos[1] + 3);
	  ctx.fill();
	};
	
	
	module.exports = Building;


/***/ },
/* 12 */
/***/ function(module, exports) {

	// handles game's interaction wtih canvas element
	
	var GameView = function (game, ctx) {
	  this.game = game;
	  this.ctx = ctx;
	};
	
	GameView.prototype.drawFrameAndLoop = function () {
	  window.requestAnimationFrame(function () {
	    this.generateFrame();
	  }.bind(this));
	};
	
	GameView.prototype.generateFrame = function () {
	  this.ctx.clearRect(0, 0, this.game.frameWidth, this.game.frameHeight);
	  this.game.draw(this.ctx);
	  this.game.advanceFrame();
	  this.drawFrameAndLoop();
	};
	
	module.exports = GameView;


/***/ },
/* 13 */
/***/ function(module, exports) {

	// handles screen-level display information
	
	var Screens = function (game) {
	  this.game = game;
	};
	
	Screens.prototype.displayScore = function (ctx) {
	  ctx.fillStyle = 'rgb(0, 0, 0)';
	  ctx.font = "36px sans-serif";
	  var displayDistance = Math.floor(this.game.runnerDistance / 100);
	  ctx.fillText(displayDistance + " m", 900, 60);
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


/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map