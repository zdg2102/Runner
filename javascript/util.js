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
