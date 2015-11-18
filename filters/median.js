var math = require('mathjs');

var MedianFilter = function(windowSize) {
  if (!windowSize) windowSize = 5;
  this.window = [];
  this.windowSize = windowSize;
};

module.exports = MedianFilter;

MedianFilter.prototype.update = function(val) {
  if (this.window.length >= this.windowSize) this.window.shift();
  this.window.push(val);
  return math.median(this.window);
};
