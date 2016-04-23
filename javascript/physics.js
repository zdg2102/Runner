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

  handleTopContact: function (movingObj, contactPos) {
    // if the only vertical velocity is gravity,
    // movingObject is standing on top of other object
    if (movingObj.vel[1] === gameConstants.gravity) {
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
    var objBLeft = objB.pos[0];
    var objBRight = objB.pos[0] + objB.width;
    var objBTop = objB.pos[1];
    var objBBottom = objB.pos[1] + objB.height;

    var contactInfo;
    if (Util.isBetween(objABottom, objBTop, objBBottom) &&
      Util.isBetween(objARight, objBLeft, objBRight)) {
      // this means objA's bottom-right corner is embedded
      // in or touching objB
      contactInfo = this.determineCrossing();

      var x_now = objARight;
      var y_now = objABottom;
      var v_x = objA.vel[0];
      var v_y = objA.vel[1];
      var y_crossing = objBTop;
      var x_crossing = objBLeft;
      var y_scaling = (y_now - y_crossing) / v_y;
      var x_scaling = (x_now - x_crossing) / v_x;
      var x_test = x_now - (y_scaling * v_x);
      var y_test = y_now - (x_scaling * v_y);
      if (y_scaling < 0 ||
        !Util.isBetween(x_test, objBLeft, objBRight)) {
        y_scaling = null;
      }
      if (x_scaling < 0 ||
        !Util.isBetween(y_test, objBTop, objBBottom)) {
        x_scaling = null;
      }
      // if both have a valid crossing, use the closer one
      if (y_scaling && x_scaling) {
        console.log("stupid case happening");
        if (y_scaling <= x_scaling) {



        } else {
          var height = objA.collideHeight || objA.height;
          var width = objA.collideWidth || objA.width;
          return {
            contactType: 'collision',
            fromDirection: 'left',
            stopPos: [x_crossing - width, y_crossing - height]
          };
        }
      } else if (y_scaling) {
        if (objAVertVel === gameConstants.gravity) {
          return {
            contactType: 'stand'
          };
        } else if (objAVertVel > 0) {
          // need to account for the runner having two height
          // values
          var height = objA.collideHeight || objA.height;
          var width = objA.collideWidth || objA.width;
          return {
            contactType: 'collision',
            fromDirection: 'above',
            stopPos: [x_test - width, y_crossing - height]
          };
        }
      } else if (x_scaling) {
        var height = objA.collideHeight || objA.height;
        var width = objA.collideWidth || objA.width;
        return {
          contactType: 'collision',
          fromDirection: 'left',
          stopPos: [x_crossing - width, y_test - height]
        };
      }

      // if scaling is negative, reversed vector
      // will never cross plane
    //   if (scaling >= 0) {
    //     x_crossing = x_now - (scaling * v_x);
    //     if (Util.isBetween(x_crossing, objBLeft, objBRight)) {
    //
    //       console.log(x_crossing + " " + y_crossing);
    //
    //       // this means the contact came through the top
    //       if (objAVertVel === gameConstants.gravity) {
    //         return {
    //           contactType: 'stand'
    //         };
    //       } else if (objAVertVel > 0) {
    //         // need to account for the runner having two height
    //         // values
    //         var height = objA.collideHeight || objA.height;
    //         var width = objA.collideWidth || objA.width;
    //         return {
    //           contactType: 'collision',
    //           fromDirection: 'above',
    //           stopPos: [x_crossing - width, y_crossing - height]
    //         };
    //       }
    //     }
    //   }
    //   // now try for collision from the left
    //   x_crossing = objBLeft;
    //   scaling = (x_now - x_crossing) / v_x;
    //   if (scaling >= 0) {
    //     y_crossing = y_now - (scaling * v_y);
    //     if (Util.isBetween(y_crossing, objBTop, objBBottom)) {
    //       console.log("hit left!");
    //       var height = objA.collideHeight || objA.height;
    //       var width = objA.collideWidth || objA.width;
    //       return {
    //         contactType: 'collision',
    //         fromDirection: 'left',
    //         stopPos: [x_crossing - width, y_crossing - height]
    //       };
    //     }
    //   }
    }


    if (Util.isBetween(objABottom, objBTop, objBBottom) &&
      (Util.isBetween(objARight, objBLeft, objBRight) ||
      Util.isBetween(objALeft, objBLeft, objBRight))) {
      // objA hits objB from above
      // if objA velocity is only equal to gravity,
      // objA is standing on objB
      // if (objAVertVel === gameConstants.gravity) {
      //   return {
      //     contactType: 'stand'
      //   };
      // } else if (objAVertVel > 0) {
      //   // need to account for the runner having two height
      //   // values
      //   var height = objA.collideHeight || objA.height;
      //   return {
      //     contactType: 'collision',
      //     fromDirection: 'above',
      //     stopPos: [objALeft, objBTop - height]
      //   };
      // }

    } else if (Util.isBetween(objATop, objBTop, objBBottom) &&
      (Util.isBetween(objARight, objBLeft, objBRight) ||
      Util.isBetween(objALeft, objBLeft, objBRight)) &&
      objAVertVel < 0) {
      // return {
      //   contactType: 'collision',
      //   fromDirection: 'below',
      //   stopPos: [objALeft, objBBottom]
      // };

    } else if (Util.isBetween(objARight, objBLeft, objBRight) &&
      (Util.isBetween(objATop, objBTop, objBBottom) ||
      Util.isBetween(objABottom, objBTop, objBBottom)) &&
      objAHorizVel > 0) {
      // objA hits objB from the left
      // need to account for the runner having two width
      // values
      // var width = objA.collideWidth || objA.width;
      // return {
      //   contactType: 'collision',
      //   fromDirection: 'left',
      //   stopPos: [objBLeft - width, objATop]
      // };

    } else if (Util.isBetween(objALeft, objBLeft, objBRight) &&
      (Util.isBetween(objATop, objBTop, objBBottom) ||
      Util.isBetween(objABottom, objBTop, objBBottom)) &&
      objAHorizVel < 0) {
      // objA hits objB from the right
      // return {
      //   contactType: 'collision',
      //   fromDirection: 'right',
      //   stopPos: [objBRight, objATop]
      // };

    } else {
      return null;
    }
  }

};

module.exports = Physics;
