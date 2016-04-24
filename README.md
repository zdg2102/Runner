# Runner

Runner is an endless runner built with HTML5 Canvas and Javascript.

Play it [here](http://www.zdgarcia.com/Runner/).

![alt text](https://github.com/zdg2102/Runner/blob/master/assets/runner_screenshot.jpg "Game Screenshot")

## Instructions

Use the left and right arrows or A and D to run.

Use the up arrow or W to jump and double-jump.

Use P to pause.

## Details

### Runner

* Sprite-based animation including standing, running, and flipping
* Current sprite animation determined based on runner's position, velocity, and the sprite animation of the previous frame
* Runner's `draw` method delegates to separate `RunnerAnimator` class that only handles selecting and rendering sprites

### Physics

* Vector-based physics including gravity, normal force, and friction
* Two-step collision detection first checks if object is in a position where a collision may have occurred, and then projects the velocity vector backwards to determine the exact point of contact (in order to determine clearly if the initial contact was on the top of a platform or the side, for example)

### Level Generation

* Semi-randomly generates new platforms (random only within preset bounds)
* Distance between platforms is constrained to have a max size, so if a platform is very high above its predecessor, it can't be very far away, while if it's at the same level or lower it can be much farther off (to avoid ever randomly generating a gap that is impossible for the player to jump across)
* Generates parallax-scrolling background with random distribution of features (building height, types of building roof, etc.)
