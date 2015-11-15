var I2C = require('i2c');

var s_short = function(v) {
  var i = (((v[0] << 8) | v[1]) << 16) >> 16;
  return i;
};

var get_short = function(data, index) {
  return s_short([data[index], data[index + 1]]);
};

var get_ushort = function(data, index) {
  return (data[index] << 8) + data[index + 1];
};

var Barometer = function(address, device, oversampling) {
  if (!address) address = 0x77;
  if (!device) device = '/dev/i2c-1';
  if (!oversampling) oversampling = 3;
  this.address = address;
  this.i2c = new I2C(address, {device: device});
  this.oversampling = oversampling;
};

module.exports = Barometer;

Barometer.prototype.write = function(command, byte, callback) {
  this.i2c.writeBytes(command, [byte], callback);
};

Barometer.prototype.readBlock = function(command, length, callback) {
  this.i2c.readBytes(command, length, callback);
};

Barometer.prototype.update = function(callback) {
  var _this = this;
  _this.measure(function(measure){
    _this.temperature = measure.temperature;
    _this.pressure = measure.pressure;
  });
};

Barometer.prototype.measure = function(callback) {
  var _this = this;
  _this.readBlock(0xAA, 22, function(err, cal) {
    if (err) throw err;
    var ac1 = get_short(cal, 0);
    var ac2 = get_short(cal, 2);
    var ac3 = get_short(cal, 4);
    var ac4 = get_ushort(cal, 6);
    var ac5 = get_ushort(cal, 8);
    var ac6 = get_ushort(cal, 10);
    var b1 = get_short(cal, 12);
    var b2 = get_short(cal, 14);
    var mb = get_short(cal, 16);
    var mc = get_short(cal, 18);
    var md = get_short(cal, 20);
    _this.write(0xF4, 0x2E, function(err) {
      setTimeout(function() {
        _this.readBlock(0xF6, 2, function(err, data) {
          if (err) throw err;
          var msb = data[0];
          var lsb = data[1];
          var ut = (msb << 8) + lsb;
          _this.write(0xF4, 0x34 + (_this.oversampling << 6), function(err, data) {
            if (err) throw err;
            setTimeout(function() {
              _this.readBlock(0xF6, 3, function(err, data) {
                if (err) throw err;
                var msb = data[0];
                var lsb = data[1];
                var xsb = data[2];
                var up = ((msb << 16) + (lsb << 8) + xsb) >> (8 - _this.oversampling);
                var x1 = ((ut - ac6) * ac5) >> 15;
                var x2 = (mc << 11) / (x1 + md);
                var b5 = x1 + x2;
                var t = (b5 + 8) >> 4;
                var b6 = b5 - 4000;
                var b62 = b6 * b6 >> 12;
                x1 = (b2 * b62) >> 12;
                x2 = ac2 * b6 >> 11;
                var x3 = x1 + x2;
                var b3 = (((ac1 * 4 + x3) << _this.oversampling) + 2) >> 2;
                x1 = ac3 * b6 >> 13;
                x2 = (b1 * b62) >> 16;
                x3 = ((x1 + x2) + 2) >> 2;
                var b4 = (ac4 * (x3 + 32768)) >> 15;
                var b7 = (up - b3) * (50000 >> _this.oversampling);
                var p = (b7 * 2) / b4;
                x1 = (p >> 8) * (p >> 8);
                x1 = (x1 * 3038) >> 16;
                x2 = (-7357 * p) >> 16;
                p = p + ((x1 + x2 + 3791) >> 4);
                callback({
                  temperature: t/10.0,
                  pressure: p/100.0
                });
              });
            }, 40);
          });
        });
      }, 5);
    });
  });
};

