var BerryIMU = require("../");

var berryIMU = new BerryIMU();

var measureF = function(measure) {
  console.log("\033[1;34;40mPitch \033[1;31;40m" + measure.pitch + "\033[1;34;40mYaw \033[1;31;40m" + measure.yaw + "\033[1;34;40mRoll \033[1;31;40m" + measure.roll + "\033[1;34;40mTemperature \033[1;31;40m" + measure.temperature + "\033[1;34;40mPressure \033[1;31;40m" + measure.pressure);
};

while (1) {
  berryIMU.measure(measureF);
}
