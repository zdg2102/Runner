// mine drawing

var Mine = function (pos, sprite) {
  this.pos = pos;
  this.sprite = sprite;
  this.width = 20;
};

Mine.prototype.draw = function (ctx) {
  ctx.drawImage(
    this.sprite, this.pos[0], this.pos[1], this.width, this.width
  );
};

module.exports = Mine;
