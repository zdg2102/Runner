// handles user input (using Keymaster library via global 'key')

var GameControls = {

  bindKeyHandlers: function (runner) {
    key('up', function () {
      runner.jump();
    });
  },

  checkHeldKeys: function (runner) {
    if (key.isPressed('left')) {
      runner.runAccelerate('left');
    } else if (key.isPressed('right')) {
      runner.runAccelerate('right');
    }
  }

};

module.exports = GameControls;
