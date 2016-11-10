'use strict';
window.onload = () => {
  const socket = io();
  let monitor = {};
//create gauges
  monitor.waterLevel = new JustGage({
    id: "waterlevel",
    value: 500,
    min: 0,
    max: 1000,
    title: "WaterLevel",
    relativeGaugeSize: true,
    labelFontColor: "#FFF",
    valueFontColor: '#3BFFAB',
    titleFontColor: '#3ADEE8',
  });

  monitor.thermometer = new JustGage({
    id: "thermometer",
    value: 60,
    min: -50,
    max: 125,
    title: "Thermometer",
    label: "° Fahrenheit",
    relativeGaugeSize: true,
    labelFontColor: "#FFF",
    valueFontColor: '#3BFFAB',
    titleFontColor: '#3ADEE8',
  });

  monitor.barometer = new JustGage({
    id: "barometer",
    value: 100,
    min: 50,
    max: 150,
    title: "Barometer",
    label: "Pressure/kPa",
    relativeGaugeSize: true,
    labelFontColor: "#FFF",
    valueFontColor: '#3BFFAB',
    titleFontColor: '#3ADEE8',
  });

  monitor.hygrometer = new JustGage({
    id: "hygrometer",
    value: 10,
    min: 0,
    max: 100,
    title: "Hygrometer",
    label: "Humidity %",
    relativeGaugeSize: true,
    labelFontColor: "#FFF",
    valueFontColor: '#3BFFAB',
    titleFontColor: '#3ADEE8',
  });

  const waterOnButton = document.getElementById('water-on-button');
  const waterOffButton = document.getElementById('water-off-button');
  const waterStatus = document.getElementById('water-status');
  let displays = Object.keys(monitor);

  socket.on('report', (data) => {
    displays.forEach((display) => {
      monitor[display].refresh(data[display]);
    });
  });

  socket.on('waterStatusUpdate', (data) => {
    waterStatus.innerText = `Watering Status: ${data.waterStatus}`;
  });

  waterOnButton.addEventListener('click', (e) => {
    socket.emit('waterOnClick');
    e.preventDefault();
  });

  waterOffButton.addEventListener('click', (e) => {
    socket.emit('waterOffClick');
    e.preventDefault();
  });

};