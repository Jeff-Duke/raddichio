'use strict';
window.onload = function() {
  const socket = io();
  let monitor = {};

  monitor.waterlevel = new JustGage({
    id: "waterlevel",
    value: 500,
    min: 0,
    max: 1000,
    title: "WaterLevel",
    relativeGaugeSize: true,
  });
  
  monitor.thermometer = new JustGage({
    id: "thermometer",
    value: 60,
    min: -50,
    max: 125,
    title: "Thermometer",
    label: "° Fahrenheit",
    relativeGaugeSize: true,
  });

  monitor.barometer = new JustGage({
    id: "barometer",
    value: 100,
    min: 50,
    max: 150,
    title: "Barometer",
    label: "Pressure/kPa",
    relativeGaugeSize: true,
  });

  monitor.hygrometer = new JustGage({
    id: "hygrometer",
    value: 10,
    min: 0,
    max: 100,
    title: "Hygrometer",
    label: "Humidity %",
    relativeGaugeSize: true,
  });
  
  var displays = Object.keys(monitor);

  socket.on("report", function (data) {
    displays.forEach(function (display) {
      monitor[display].refresh(data[display]);
    });
  });
  
  const waterOnButton = document.getElementById('water-on-button');
  const waterOffButton = document.getElementById('water-off-button');
  
  waterOnButton.addEventListener('click', (e) => {
    socket.emit('waterOnClick');
    e.preventDefault();
  });

  waterOffButton.addEventListener('click', (e) => {
    socket.emit('waterOffClick');
    e.preventDefault();
  });

};