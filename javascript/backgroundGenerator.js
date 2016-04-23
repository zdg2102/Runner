// for filling the background

var Building = require('./building');
var gameConstants = require('./gameConstants');

var BackgroundGenerator = function (game) {
  this.game = game;
  this.backgroundObjects = [];
  this.lastObject = null;
  this.buildingHeight = this.game.frameHeight;
  this.populateInitialScreen();
};

BackgroundGenerator.prototype.populateInitialScreen = function () {
  var width = Math.floor(gameConstants.buildingMinWidth +
    Math.random() * gameConstants.buildingAddWidth);
  var left = -(width / 3);
  var building;
  while (left < this.game.frameWidth) {
    var top = Math.random() * (this.game.frameHeight * 0.7);
    building = new Building([left, top],
      width, this.buildingHeight, this.game);
    this.backgroundObjects.push(building);
    left += width;
    width = Math.floor(gameConstants.buildingMinWidth +
      Math.random() * gameConstants.buildingAddWidth);
  }
  this.lastObject = building;
};

BackgroundGenerator.prototype.checkAndAddBuilding = function () {
  if (this.lastObject.pos[0] + this.lastObject.width <
    this.game.frameWidth + 2) {
    var width = Math.floor(gameConstants.buildingMinWidth +
      Math.random() * gameConstants.buildingAddWidth);
    var left = this.lastObject.pos[0] + this.lastObject.width;
    var top = Math.random() * (this.game.frameHeight / 3);
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
