var I2C = require('i2c');
var LSM9DS0 = require('./registers').LSM9DS0;

var binary = function(i) {
  return Number.parseInt(i, 2);
};

var Gyroscope = function(address, device) {
  if (!address) address = LSM9DS0.GYR_ADDRESS;
  if (!device) device = '/dev/i2c-1';
  this.address = address;
  this.i2c = new I2C(address, {device: device});
};

module.exports = Gyroscope;

Gyroscope.prototype.write = function(command, byte, callback) {
  this.i2c.writeBytes(command, [byte], callback);
};

Gyroscope.prototype.read = function(command, callback) {
  this.i2c.readBytes(command, 1, callback);
};

Gyroscope.prototype.initialize = function(callback) {
  var _this = this;
  _this.write(LSM9DS0.CTRL_REG1_XM, binary('00001111'), function(err) {
    if (err) throw err;
    _this.write(LSM9DS0.CTRL_REG4_XM, binary('00110000'), function(err) {
      if (err) throw err;
      callback();
    });
  });
};

Gyroscope.prototype.x = function(callback) {
  var _this = this;
  _this.read(LSM9DS0.OUT_X_L_G, function(err, res) {
    if (err) throw err;
    var acc_l = res[0];
    _this.read(LSM9DS0.OUT_X_H_G, function(err, res) {
      if (err) throw err;
      var acc_h = res[0];
      var acc = (acc_l | acc_h << 8);
      callback(acc < 32768 ? acc : acc - 65536);
    });
  });
};

Gyroscope.prototype.y = function(callback) {
  var _this = this;
  _this.read(LSM9DS0.OUT_Y_L_G, function(err, res) {
    if (err) throw err;
    var acc_l = res[0];
    _this.read(LSM9DS0.OUT_Y_H_G, function(err, res) {
      if (err) throw err;
      var acc_h = res[0];
      var acc = (acc_l | acc_h << 8);
      callback(acc < 32768 ? acc : acc - 65536);
    });
  });
};

Gyroscope.prototype.z = function(callback) {
  var _this = this;
  _this.read(LSM9DS0.OUT_Z_L_G, function(err, res) {
    if (err) throw err;
    var acc_l = res[0];
    _this.read(LSM9DS0.OUT_Z_H_G, function(err, res) {
      if (err) throw err;
      var acc_h = res[0];
      var acc = (acc_l | acc_h << 8);
      callback(acc < 32768 ? acc : acc - 65536);
    });
  });
};
