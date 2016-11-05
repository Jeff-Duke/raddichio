'use strict';
const http = require("http");
const os = require("os");
const path = require("path");

const five = require("johnny-five");
const Tessel = require("tessel-io");
const board = new five.Board({
  io: new Tessel()
});

const Express = require("express");
const SocketIO = require("socket.io");

const application = new Express();
const server = new http.Server(application);
const io = new SocketIO(server);

application.use(Express.static(path.join(__dirname, "/app")));
application.use("/vendor", Express.static(__dirname + "/node_modules/"));

board.on("ready", () => {
  const clients = new Set();
  
  const dry = new five.Led('b2');
  const wet = new five.Led('b3');
  const waterSensor = new five.Sensor('a7');
  const waterValve = new five.Pin('b7');

  const monitor = new five.Multi({
    controller: "BME280",
  });

  let updated = Date.now() - 5000;

  const environmentMonitor = () => {
    let now = Date.now();
    if (now - updated >= 5000) {
      updated = now;

      clients.forEach(recipient => {
        recipient.emit("report", {
          thermometer: monitor.thermometer.fahrenheit,
          barometer:   monitor.barometer.pressure,
          hygrometer:  monitor.hygrometer.relativeHumidity,
        });
      });
    }
  };

  const checkWaterSensor = () => {
    if (waterSensor.value < 300) {
      wet.off();
      dry.on();
      waterValve.high();
      clients.forEach(recipient => {
        recipient.emit("report", {
          waterLevel: waterSensor.value,
          waterStatus: 'Running',
        });
      });
    }

    if (waterSensor.value > 300) {
      wet.on();
      dry.off();
      waterValve.low();
      clients.forEach(recipient => {
        recipient.emit("report", {
          waterLevel: waterSensor.value,
          waterStatus: 'Running',
        });
      });
    }
  };

  const monitorSystem = () => {
    checkWaterSensor();
    environmentMonitor();
    setTimeout(monitorSystem, 30000);
  };

  monitorSystem();

  io.on("connection", socket => {
    // Allow up to 5 monitor sockets to
    // connect to this enviro-monitor server
    if (clients.size < 5) {
      clients.add(socket);
      // When the socket disconnects, remove
      // it from the recipient set.
      socket.on("disconnect", () => clients.delete(socket));
    }
  });

  const port = 3000;
  server.listen(port, () => {
    console.log(`http://${os.networkInterfaces().wlan0[0].address}:${port}`);
  });

  process.on("SIGINT", () => {
    server.close();
  });
});
