'use strict';
const Tessel = require('tessel-io');
const five = require('johnny-five');
const board = new five.Board({
  io: new Tessel()
});

board.on('ready', () => {
  const dry = new five.Led('b2');
  const wet = new five.Led('b3');
  const moistureSensor = new five.Sensor('a7');
  const valve = new five.Pin('b7');

  const checkReservoir = () => {
   
    if (moistureSensor.value < 300) {
      wet.off();
      dry.on();
      valve.high();

      console.log('**********************');
      console.log('Dry', 'Moisture Level ' + moistureSensor.value);
      console.log('**********************');
    } 
    else {
    
    if (moistureSensor.value > 300) {
        dry.off();
        wet.on();
        valve.low();

        console.log('**********************');
        console.log('Wet', 'Moisture Level ' + moistureSensor.value);
        console.log('**********************');
      }
    
    }
    setTimeout(checkReservoir, 1000);
  };
  
  checkReservoir();
});
