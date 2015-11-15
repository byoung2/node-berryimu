var I2C = require('i2c');
var LSM9DS0 = require('../registers').LSM9DS0;

var binary = function(i) {
  return Number.parseInt(i, 2);
};

var Magnetometer = function(address, device) {
  if (!address) address = LSM9DS0.MAG_ADDRESS;
  if (!device) device = '/dev/i2c-1';
  this.address = address;
  this.i2c = new I2C(address, {device: device});
};

module.exports = Magnetometer;

Magnetometer.prototype.write = function(command, byte, callback) {
  this.i2c.writeBytes(command, [byte], callback);
};

Magnetometer.prototype.read = function(command, callback) {
  this.i2c.readBytes(command, 1, callback);
};

Magnetometer.prototype.initialize = function(callback) {
  var _this = this;
  this.write(LSM9DS0.CTRL_REG5_XM, binary('11110000'), function(err) {
    if (err) throw err;
    _this.write(LSM9DS0.CTRL_REG6_XM, binary('01100000'), function(err) {
      if (err) throw err;
      _this.write(LSM9DS0.CTRL_REG7_XM, binary('00000000'), function(err) {
        if (err) throw err;
        callback();
      });
    });
  });
};

Magnetometer.prototype.update = function(callback) {
  var _this = this;
  _this.readX(function(x) {
    _this.readY(function(y) {
      _this.readZ(function(z) {
        _this.x = x;
        _this.y = y;
        _this.z = z;
        callback();
      });
    });
  });
};

Magnetometer.prototype.readX = function(callback) {
  var _this = this;
  _this.read(LSM9DS0.OUT_X_L_M, function(err, res) {
    if (err) throw err;
    var acc_l = res[0];
    _this.read(LSM9DS0.OUT_X_H_M, function(err, res) {
      if (err) throw err;
      var acc_h = res[0];
      var acc = (acc_l | acc_h << 8);
      callback(acc < 32768 ? acc : acc - 65536);
    });
  });
};

Magnetometer.prototype.readY = function(callback) {
  var _this = this;
  _this.read(LSM9DS0.OUT_Y_L_M, function(err, res) {
    if (err) throw err;
    var acc_l = res[0];
    _this.read(LSM9DS0.OUT_Y_H_M, function(err, res) {
      if (err) throw err;
      var acc_h = res[0];
      var acc = (acc_l | acc_h << 8);
      callback(acc < 32768 ? acc : acc - 65536);
    });
  });
};

Magnetometer.prototype.readZ = function(callback) {
  var _this = this;
  _this.read(LSM9DS0.OUT_Z_L_M, function(err, res) {
    if (err) throw err;
    var acc_l = res[0];
    _this.read(LSM9DS0.OUT_Z_H_M, function(err, res) {
      if (err) throw err;
      var acc_h = res[0];
      var acc = (acc_l | acc_h << 8);
      callback(acc < 32768 ? acc : acc - 65536);
    });
  });
};
