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

  detectContact: function (objA, objB) {
    // if there is contact, returns an object containing
    // information on the contact
    // otherwise returns null

    // set up variable aliases for easier reading
    var objALeft = objA.pos[0];
    var objARight = objA.pos[0] + objA.width;
    var objATop = objA.pos[1];
    var objABottom = objA.pos[1] + objA.height;
    var objAHorizVel = objA.vel[0];
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
        // need to account for the runner having two height
        // values
        var height = objA.collideHeight || objA.height;
        return {
          contactType: 'collision',
          fromDirection: 'above',
          stopPos: [objALeft, objBTop - height]
        };
      }

    } else if (Util.isBetween(objATop, objBTop, objBBottom) &&
      (Util.isBetween(objARight, objBLeft, objBRight) ||
      Util.isBetween(objALeft, objBLeft, objBRight)) &&
      objAVertVel < 0) {
      return {
        contactType: 'collision',
        fromDirection: 'below',
        stopPos: [objALeft, objBBottom]
      };

    } else if (Util.isBetween(objARight, objBLeft, objBRight) &&
      (Util.isBetween(objATop, objBTop, objBBottom) ||
      Util.isBetween(objABottom, objBTop, objBBottom)) &&
      objAHorizVel > 0) {
      // objA hits objB from the left
      // need to account for the runner having two width
      // values
      var width = objA.collideWidth || objA.width;
      return {
        contactType: 'collision',
        fromDirection: 'left',
        stopPos: [objBLeft - width, objATop]
      };

    } else if (Util.isBetween(objALeft, objBLeft, objBRight) &&
      (Util.isBetween(objATop, objBTop, objBBottom) ||
      Util.isBetween(objABottom, objBTop, objBBottom)) &&
      objAHorizVel < 0) {
      // objA hits objB from the right
      return {
        contactType: 'collision',
        fromDirection: 'right',
        stopPos: [objBRight, objATop]
      };

    } else {
      return null;
    }
  }

};

module.exports = Physics;
