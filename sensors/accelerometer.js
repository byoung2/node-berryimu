var I2C = require('i2c');
var LSM9DS0 = require('./registers').LSM9DS0;

var binary = function(i) {
  return Number.parseInt(i, 2);
};

var Accelerometer = function(address, device) {
  if (!address) address = LSM9DS0.ACC_ADDRESS;
  if (!device) device = '/dev/i2c-1';
  this.address = address;
  this.i2c = new I2C(address, {device: device});
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
  this.write(LSM9DS0.CTRL_REG1_XM, binary('01100111'), function(err) {
    if (err) throw err;
    _this.write(LSM9DS0.CTRL_REG2_XM, binary('00100000'), function(err) {
      if (err) throw err;
      callback();
    });
  });
};

Accelerometer.prototype.x = function(callback) {
  var _this = this;
  _this.read(LSM9DS0.OUT_X_L_A, function(err, res) {
    if (err) throw err;
    var acc_l = res[0];
    _this.read(LSM9DS0.OUT_X_H_A, function(err, res) {
      if (err) throw err;
      var acc_h = res[0];
      var acc = (acc_l | acc_h << 8);
      callback(acc < 32768 ? acc : acc - 65536);
    });
  });
};

Accelerometer.prototype.y = function(callback) {
  var _this = this;
  _this.read(LSM9DS0.OUT_Y_L_A, function(err, res) {
    if (err) throw err;
    var acc_l = res[0];
    _this.read(LSM9DS0.OUT_Y_H_A, function(err, res) {
      if (err) throw err;
      var acc_h = res[0];
      var acc = (acc_l | acc_h << 8);
      callback(acc < 32768 ? acc : acc - 65536);
    });
  });
};

Accelerometer.prototype.z = function(callback) {
  var _this = this;
  _this.read(LSM9DS0.OUT_Z_L_A, function(err, res) {
    if (err) throw err;
    var acc_l = res[0];
    _this.read(LSM9DS0.OUT_Z_H_A, function(err, res) {
      if (err) throw err;
      var acc_h = res[0];
      var acc = (acc_l | acc_h << 8);
      callback(acc < 32768 ? acc : acc - 65536);
    });
  });
};
