var BerryIMU = require("../");

var async = require('async');

var lastTime = new Date();

var readline = require('readline');

var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

var berryIMU = new BerryIMU();
berryIMU.initialize(function() {
  rl.question("Stabalize sensor and press ENTER to continue", function() {
    async.whilst(function() {
      return true;
    }, function(callback) {
      berryIMU.update(function() {
        console.log("\033[1;34;40mPitch \033[1;31;40m" + berryIMU.pitch + " \033[1;34;40mYaw \033[1;31;40m" + berryIMU.yaw + " \033[1;34;40mRoll \033[1;31;40m" + berryIMU.roll + " \033[1;34;40mTemperature \033[1;31;40m" + berryIMU.barometer.temperature + " \033[1;34;40mPressure \033[1;31;40m" + berryIMU.barometer.pressure + " \033[1;34;40maccX \033[1;31;40m" + berryIMU.accelerometer.x + " \033[1;34;40maccY \033[1;31;40m" + berryIMU.accelerometer.y + " \033[1;34;40maccZ \033[1;31;40m" + berryIMU.accelerometer.z + " \033[1;34;40mdt \033[1;31;40m" + (new Date() - lastTime));
        lastTime = new Date();
        callback();
      });
    });
  });
});
