var Util = {
  inherits: function (ChildClass, ParentClass) {
    var Surrogate = function () {};
    Surrogate.prototype = ParentClass.prototype;
    ChildClass.prototype = new Surrogate();
    ChildClass.prototype.constructor = ChildClass;
  },

  gravity: function (vel) {
    return [vel[0], vel[1] + 0.3]
  }
};

module.exports = Util;
