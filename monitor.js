'use strict';

const http = require("http");
const os = require("os");
const path = require("path");
const got = require('got');
const config = require('./microcontroller-code/phant-config');
const Express = require("express");
const SocketIO = require("socket.io");
const application = new Express();
const server = new http.Server(application);
const io = new SocketIO(server);

const five = require('johnny-five');
const Tessel = require("tessel-io");
const board = new five.Board({
  io: new Tessel()
});

let manualControls = false;

application.use(Express.static(path.join(__dirname, "/app")));
application.use("/vendor", Express.static(__dirname + "/node_modules/"));

board.on('ready', () => {
  const dry = new five.Led('b2');
  const wet = new five.Led('b3');
  const moistureSensor = new five.Sensor('a7');

  const monitor = new five.Multi({
    controller: 'BME280'
  });

  const valve = new five.Servo({
    pin: 'b6',
    range: [0, 90],
    startAt: 0
  });

  const clients = new Set();
  let updated = Date.now() - 5000;

  //** sensor state **
  let waterLevel;
  let temperature;
  let humidity;
  let barometer;
  let waterStatus;

  //** valve controls **

  const waterOff = () => {
    valve.min();
    dry.off();
    wet.on();
    waterStatus = 'Off';
  };

  const waterOn = () => {
    valve.max();
    dry.on();
    wet.off();
    waterStatus = 'Running';
  };

  // const toggleManualControls = () => {
  //   manualControls === false ? manualControls = true : manualControls = false;
  // };

  const checkMoistureSensor = () => {
    waterLevel = moistureSensor.value;
    if (manualControls === false) {
      if (moistureSensor.value < 300) {
        waterOn();
      }

      if (moistureSensor.value > 300) {
        waterOff();
      }
    }
    setTimeout(checkMoistureSensor, 1000);
  };

  monitor.on('change', () => {
    temperature = Math.round(monitor.thermometer.fahrenheit);
    humidity = Math.round(monitor.hygrometer.relativeHumidity);
    barometer = Math.round(monitor.barometer.pressure);


    let now = Date.now();
    if (now - updated >= 5000) {
      updated = now;

      clients.forEach(recipient => {

        recipient.emit("report", {
          thermometer: temperature,
          barometer: barometer,
          hygrometer: humidity,
          waterlevel: waterLevel,
          waterstatus: waterStatus,
        });
      });
    }
  });

  const logLevels = () => {
    const phantUrl = `http://data.sparkfun.com/input/${config.publicKey}?private_key=${config.privateKey}&humidity=${humidity}&moisturelevel=${waterLevel}&pressure=${barometer}&temp=${temperature}&waterstatus=${waterStatus}`;

    got(phantUrl)
      .then(response => {
        console.log(response.body);
      })
      .catch(error => {
        console.log(error.response.body);
        setTimeout(logLevels, 10000);
      });

    setTimeout(logLevels, 300000);
  };

  checkMoistureSensor();
  (waterLevel || temperature || humidity || barometer) ? logLevels(): setTimeout(logLevels, 5000);

  //initialize express server connections
  io.on("connection", socket => {
    socket.on('waterOnClick', function () {
      manualControls = true;
      waterOn();
    });

    socket.on('waterOffClick', function () {
      waterOff();
      manualControls = false;
    });

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