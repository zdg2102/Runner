// handles user input (using Keymaster library via global 'key')

var GameControls = {

  bindKeyHandlers: function (game, runner) {
    key('up', function () {
      runner.jump();
    });
    key('p', function () {
      game.togglePause();
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
