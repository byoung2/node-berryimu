var sensors = require('./sensors');

var BerryIMU = function(device) {
  this.accelerometer = new sensors.Accelerometer(null, device);
  this.magnetometer = new sensors.Magnetometer(null, device);
  this.gyroscope = new sensors.Gyroscope(null, device);
  this.barometer = new sensors.Barometer(null, device);
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

BerryIMU.prototype.update = function(callback) {
  var _this = this;
  _this.accelerometer.update(function() {
    _this.gyroscope.update(function() {
      _this.magnetometer.update(function() {
        _this.barometer.update(function() {
          var accX = _this.accelerometer.x;
          var accY = _this.accelerometer.y;
          var accZ = _this.accelerometer.z;
          var magX = _this.magnetometer.x;
          var magY = _this.magnetometer.y;
          var accXNorm = accX/Math.sqrt(accX * accX + accY * accY + accZ * accZ);
          var accYNorm = accY/Math.sqrt(accX * accX + accY * accY + accZ * accZ);
          var pitch = Math.atan2(accY, accZ) * (180 / Math.PI);
          var yaw = Math.atan2(magY, magX) / (180 / Math.PI);
          var roll = Math.atan2(accX, accZ) * (180 / Math.PI);
          _this.pitch = pitch < 0 ? pitch + 360 : pitch;
          _this.yaw = yaw < 0 ? yaw + 360 : yaw;
          _this.roll = roll < 0 ? roll + 360 : roll;
          callback();
        });
      });
    });
  });
};
