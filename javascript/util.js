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
