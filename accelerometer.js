var I2C = require('i2c');
var LSM9DS0 = require('./registers').LSM9DS0;

var binary = function(i) {
  return Number.parseInt(i, 2);
};

var Accelerometer = function(address) {
  if (!address) address = LSM9DS0.ACC_ADDRESS;
  this.address = address;
  this.i2c = new I2C(address, {device: '/dev/i2c-1'});
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
    _this.write(LSM9DS0.CTRL_REG2_XM, binary('00100000'), callback);
  });
};

Accelerometer.prototype.readACCX = function(callback) {
  var acc_l = this.read(LSM9DS0.OUT_X_L_A, function(err, res) {
    if (err) throw err;
    callback(res);
  });
};

var berryIMU = new Accelerometer();
berryIMU.initialize(function(err) {
  if (err) throw err;
  berryIMU.readACCX(function(res) {
    console.log(res[0]);
  });
});
