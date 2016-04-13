// for dealing with gravity and collisions

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
