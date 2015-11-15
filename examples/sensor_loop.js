var BerryIMU = require("../");

var async = require('async');

var lastTime = new Date(); 

var berryIMU = new BerryIMU(null, function() {
  async.whilst(function() {
    return true;
  }, function(callback) {
    berryIMU.measure(function(measure) {
      console.log("\033[1;34;40mPitch \033[1;31;40m" + measure.pitch + " \033[1;34;40mYaw \033[1;31;40m" + measure.yaw + " \033[1;34;40mRoll \033[1;31;40m" + measure.roll + " \033[1;34;40mTemperature \033[1;31;40m" + measure.temperature + " \033[1;34;40mPressure \033[1;31;40m" + measure.pressure + " \033[1;34;40maccX \033[1;31;40m" + measure.accelerometer.x + " \033[1;34;40maccY \033[1;31;40m" + measure.accelerometer.y + " \033[1;34;40maccZ \033[1;31;40m" + measure.accelerometer.z + " \033[1;34;40mdt \033[1;31;40m" + (new Date() - lastTime));
      lastTime = new Date();
      callback();
    });
  });
});


