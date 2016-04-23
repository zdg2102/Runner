// for dealing with gravity, friction, collisions, and contact

var gameConstants = require('./gameConstants');
var Util = require('./util');

var Physics = {

  addGravity: function (vel) {
    var gravityVector = [0, gameConstants.gravity];
    // console.log(vel);
    // debugger;
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

  handleTopContact: function (movingObj, contactPos) {
    // if the only vertical velocity is gravity,
    // movingObject is standing on top of other object
    // console.log(movingObj.vel[1]);
    if (movingObj.vel[1] === 0 || movingObj.vel[1] === gameConstants.gravity * 2) {
      return {
        contactType: 'stand'
      };
    } else if (movingObj.vel[1] > 0) {
      // take collideHeight if it's available (only runner
      // has it), otherwise take height
      var height = movingObj.collideHeight || movingObj.height;
      var width = movingObj.collideWidth || movingObj.width;
      return {
        contactType: 'collision',
        fromDirection: 'above',
        stopPos: [contactPos[0] - width, contactPos[1] - height]
      };
    }
  },

  handleLeftContact: function (movingObj, contactPos) {
    // if the only vertical velocity is gravity,
    // movingObject is stuck to the side of the other
    // object
    if (movingObj.vel[1] === gameConstants.gravity) {
      return {
        contactType: 'stick'
      };
    } else if (movingObj.vel[0] > 0) {
      // take collideHeight if it's available (only runner
      // has it), otherwise take height
      var height = movingObj.collideHeight || movingObj.height;
      var width = movingObj.collideWidth || movingObj.width;
      return {
        contactType: 'collision',
        fromDirection: 'left',
        stopPos: [contactPos[0] - width, contactPos[1] - height]
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
    var scalingY = (nowY - surfaceY) / velY;
    var scalingX = (nowX - surfaceX) / velX;
    var projectedX = nowX - (scalingY * velX);
    var projectedY = nowY - (scalingX * velY);
    // a crossing is invalid if the scaling is negative
    // (which means the vector is pointed the wrong way),
    // or if the projected other point is not within
    // the allowed bounds
    if (scalingY < 0 || !Util.isBetween(projectedX,
      surfaceYLeft, surfaceYRight)) {
      scalingY = null;
    }
    if (scalingX < 0 || !Util.isBetween(projectedY,
      surfaceXTop, surfaceXBottom)) {
      scalingX = null;
    }
    if (scalingY && scalingX) {
      // should very rarely occur, but defaults in favor
      // of top
      return {
        surface: 'y',
        contactPos: [projectedX, surfaceY]
      };
    } else if (scalingY) {
      return {
        surface: 'y',
        contactPos: [projectedX, surfaceY]
      };
    } else if (scalingX) {
      return {
        surface: 'x',
        contactPos: [surfaceX, projectedY]
      };
    } else {
      return {
        surface: null,
        contactPos: null
      };
    }

  },

  detectContact: function (objA, objB) {
    // if there is contact, returns an object containing
    // information on the contact
    // otherwise returns null

    // set up variable aliases for easier reading
    // need to account for the runner having two heights
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
    if (Util.isBetween(objABottom, objBTop, objBBottom) &&
      Util.isBetween(objARight, objBLeft, objBRight)) {
      // this means objA's bottom-right corner is embedded
      // in or touching objB
      contactInfo = this.determineCrossing(
        objARight, objABottom, objA.vel[0], objA.vel[1],
        objBLeft, objBTop, objBBottom, objBTop, objBLeft,
        objBRight
      );
      contactSurface = contactInfo.surface;
      contactPos = contactInfo.contactPos;

      if (contactSurface === 'y') {
        return this.handleTopContact(objA, contactPos);
      } else if (contactSurface === 'x') {
        return this.handleLeftContact(objA, contactPos);
      }


    } else {
      return null;
    }
  }

};

module.exports = Physics;
