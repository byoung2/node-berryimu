var sensors = require('./sensors');

var BerryIMU = function(device, callback) {
  this.accelerometer = new sensors.Accelerometer(null, device);
  this.magnetometer = new sensors.Magnetometer(null, device);
  this.gyroscope = new sensors.Gyroscope(null, device);
  this.barometer = new sensors.Barometer(null, device);
  this.initialize(callback);
};

module.exports = BerryIMU;

BerryIMU.prototype.initialize = function(callback) {
  var _this = this;
  _this.accelerometer.initialize(function() {
    _this.magnetometer.initialize(function() {
      _this.gyroscope.initialize(callback);
    });  
  });
};

BerryIMU.prototype.angles = function(callback) {
  var _this = this;
  _this.accelerometer.x(function(accX) {
    _this.accelerometer.y(function(accY) {
      _this.accelerometer.z(function(accZ) {
        _this.magnetometer.x(function(magX) {
          _this.magnetometer.y(function(magY) {
            var accXNorm = accX/Math.sqrt(accX * accX + accY * accY + accZ * accZ);
            var accYNorm = accY/Math.sqrt(accX * accX + accY * accY + accZ * accZ);
            var pitch = Math.asin(accXNorm);
            var yaw = 180 * Math.atan2(magY, magX) / Math.PI;
            var roll = -Math.asin(accYNorm/Math.cos(pitch));
            callback({
              pitch: pitch,
              yaw: yaw < 0 ? yaw + 360 : yaw,
              roll: roll
            });
          });
        });
      });
    });
  });
};

BerryIMU.prototype.measure = function(callback) {
  var _this = this;
  _this.angles(function(angles) {
    _this.barometer.measure(function(barometer) {
      callback({
        pitch: angles.pitch,
        yaw: angles.yaw,
        roll: angles.roll,
        temperature: barometer.temperature,
        pressure: barometer.pressure
      });
    });
  });
};
