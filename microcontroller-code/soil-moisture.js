'use strict';

const got = require('got');
const config = require('./phant-config');

const Tessel = require('tessel-io');
const five = require('johnny-five');
const board = new five.Board({
  io: new Tessel()
});

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

  dry.on();

  //** sensor data **
  let waterLevel;
  let temperature;
  let humidity;
  let barometer;
  let waterStatus;

  const waterOff = () => {
    valve.min();
    waterStatus = 'Off';
  };

  const waterOn = () => {
    valve.max();
    waterStatus = 'Running';
  };

  moistureSensor.on('change', () => {
    waterLevel = moistureSensor.value;
    if (moistureSensor.value < 300) {
      dry.on();
      wet.off();
      waterOn();
    }

    if (moistureSensor.value > 300) {
      dry.off();
      wet.on();
      waterOff();
    }
  });

  monitor.on('change', () => {
     temperature = Math.round(monitor.thermometer.fahrenheit);
     humidity = Math.round(monitor.hygrometer.relativeHumidity);
     barometer = Math.round(monitor.barometer.pressure);
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
  (waterLevel || temperature || humidity || barometer) ? logLevels() : setTimeout(logLevels, 5000);
});

