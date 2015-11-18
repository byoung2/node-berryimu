var LowPassFilter = function(alpha) {
  if (!alpha) alpha = 0.25;
  this.alpha = alpha;
  this.lastValue = false;
};

module.exports = LowPassFilter;

LowPassFilter.prototype.update = function(value) {
  if (this.lastValue === false)
    this.lastValue = value;

  var newValue = this.lastValue + this.alpha * (value - this.lastValue);
  this.lastValue = value;
  return newValue;
};
