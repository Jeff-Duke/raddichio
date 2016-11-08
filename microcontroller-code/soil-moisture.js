'use strict';

const got = require('got');
const phant = require('phant');

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
    pin: 'b7',
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

  //phant info
  const phantUrl = `http://data.sparkfun.com/input/${phant.publicKey}?private_key=${phant.privateKey}&humidity=${humidity}&moisturelevel=${waterLevel}&pressure=${barometer}&temp=${temperature}&waterstatus=${waterStatus}`;

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
    if(waterLevel || temperature || humidity || barometer) {
      got(phantUrl, (error, response, body) => {
        if (!error && response.statusCode == 200) {
          console.log(body);
        }
        if(error) {
          console.error(error);
          setTimeout(logLevels, 10000);
        }
      });
    }
    setTimeout(logLevels, 300000);
  };

  logLevels();
});
