var MedianFilter = require('../filters').Median;
var I2C = require('i2c');
var LSM9DS0 = require('../registers').LSM9DS0;

var binary = function(i) {
  return Number.parseInt(i, 2);
};

var Accelerometer = function(address, device) {
  if (!address) address = LSM9DS0.ACC_ADDRESS;
  if (!device) device = '/dev/i2c-1';
  this.address = address;
  this.i2c = new I2C(address, {device: device});
  this.xFilter = new MedianFilter();
  this.yFilter = new MedianFilter();
  this.zFilter = new MedianFilter();
  this.state = {};
};

module.exports = Accelerometer;

Accelerometer.prototype.write = function(command, byte, callback) {
  this.i2c.writeBytes(command, [byte], callback);
};

Accelerometer.prototype.read = function(command, callback) {
  this.i2c.readBytes(command, 1, callback);
};

Accelerometer.prototype.initialize = function(callback) {
  var _this = this;
  _this.write(LSM9DS0.CTRL_REG1_XM, binary('01100111'), function(err) {
    if (err) throw err;
    _this.write(LSM9DS0.CTRL_REG2_XM, binary('00100000'), function(err) {
      if (err) throw err;
      callback();
    });
  });
};

Accelerometer.prototype.update = function(callback) {
  var _this = this;
  _this.readX(function(x) {
    _this.readY(function(y) {
      _this.readZ(function(z) {
        _this.raw = {
          x: x,
          y: y,
          z: z
        };
        _this.x = (_this.state.stableX) ? _this.state.stableX - x : x;
        _this.y = (_this.state.stableY) ? _this.state.stableY - y : y;
        _this.z = (_this.state.stableZ) ? _this.state.stableZ - z : z;
        callback();
      });
    });
  });
};

Accelerometer.prototype.setStable = function(callback) {
  var _this = this;
  _this.update(function() {
    _this.state = {
      stableX: _this.raw.x,
      stableY: _this.raw.y,
      stableZ: _this.raw.z
    };
    callback();
  });
};

Accelerometer.prototype.readX = function(callback) {
  var _this = this;
  _this.read(LSM9DS0.OUT_X_L_A, function(err, res) {
    if (err) throw err;
    var acc_l = res[0];
    _this.read(LSM9DS0.OUT_X_H_A, function(err, res) {
      if (err) throw err;
      var acc_h = res[0];
      var acc = (acc_l | acc_h << 8);
      callback(_this.xFilter.update(acc < 32768 ? acc : acc - 65536));
    });
  });
};

Accelerometer.prototype.readY = function(callback) {
  var _this = this;
  _this.read(LSM9DS0.OUT_Y_L_A, function(err, res) {
    if (err) throw err;
    var acc_l = res[0];
    _this.read(LSM9DS0.OUT_Y_H_A, function(err, res) {
      if (err) throw err;
      var acc_h = res[0];
      var acc = (acc_l | acc_h << 8);
      callback(_this.yFilter.update(acc < 32768 ? acc : acc - 65536));
    });
  });
};

Accelerometer.prototype.readZ = function(callback) {
  var _this = this;
  _this.read(LSM9DS0.OUT_Z_L_A, function(err, res) {
    if (err) throw err;
    var acc_l = res[0];
    _this.read(LSM9DS0.OUT_Z_H_A, function(err, res) {
      if (err) throw err;
      var acc_h = res[0];
      var acc = (acc_l | acc_h << 8);
      callback(_this.zFilter.update(acc < 32768 ? acc : acc - 65536));
    });
  });
};
