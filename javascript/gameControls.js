// handles user input (using Keymaster library via global 'key')

var GameControls = {

  bindKeyHandlers: function (game, runner) {
    key('up', function () {
      runner.jump();
    });
    key('w', function () {
      runner.jump();
    });
    key('p', function () {
      game.togglePause();
    });
    key('return', function () {
      game.closeInfoScreen();
    });
  },

  checkHeldKeys: function (runner) {
    if (key.isPressed('left')) {
      runner.runAccelerate('left');
    } else if (key.isPressed('right')) {
      runner.runAccelerate('right');
    } else if (key.isPressed('a')) {
      runner.runAccelerate('left');
    } else if (key.isPressed('d')) {
      runner.runAccelerate('right');
    }
  }

};

module.exports = GameControls;
