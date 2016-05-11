// for dealing with gravity, friction, collisions, and contact

var gameConstants = require('./gameConstants');
var Util = require('./util');

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
    // includes additional checks for zero to avoid
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
    // (height and width account for the runner's relevant
    // height and width variables having a different name)
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
