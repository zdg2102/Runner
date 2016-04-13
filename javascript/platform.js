// basic platform for running and jumping on
// a platform's position is defined by its top-left corner

var Platform = function (pos, height, width) {
  this.pos = pos;
  this.height = height;
  this.width = width;
}

Platform.prototype.draw = function (ctx) {
  ctx.fillStyle = 'rgb(96, 88, 119)';
  ctx.fillRect(this.pos[0], this.pos[1], this.width, this.height)
}

module.exports = Platform;
