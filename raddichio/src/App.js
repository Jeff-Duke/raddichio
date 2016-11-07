import $ from 'jquery';
import React, { Component } from 'react';
import LineGraph from './LineGraph.js';
import moment from 'moment';

export default class App extends Component {
  constructor() {
    super();
    this.state = {
     rawdata: null,
    };
  }

  componentDidMount() {
    this.retrieveDataFromDatabase();
  }

  retrieveDataFromDatabase() {
    const publicKey = 'ZG4drKRxMocl6a5L7WrY';
    
    $.ajax({
      url: `http://data.sparkfun.com/output/${publicKey}.json`,
        jsonp: 'callback',
        cache: true,
        dataType: 'jsonp',
        data: {
          page: 1
        },
        success: (response) => {
          this.setState({ rawdata: response });
          setTimeout(this.retrieveDataFromDatabase.bind(this), 300000);
        },
        error: (error) => {
          console.error(error);
          setTimeout(this.retrieveDataFromDatabase.bind(this), 10000);
        }
    });
  }

  render() {
    
    let timeStamps = [];
    let temperatures = [];
    let humidity = [];
    let moistureLevel = [];
    let pressure = [];
   

    if (this.state.rawdata) {
      this.state.rawdata.forEach(item => {
        timeStamps.unshift(moment(item.timestamp).format('MM/DD H:m A'));
        temperatures.unshift(item.temp);
        humidity.unshift(item.humidity);
        moistureLevel.unshift(item.moisturelevel);
        pressure.unshift(item.pressure);
      });
    }
    
    return (
      <div className="App">
        
          <div id='chart-container'>
            <h3>Water Status: { this.state.rawdata ? this.state.rawdata[0].waterstatus : 'Updating...' }</h3>

            <LineGraph data={temperatures} labels={timeStamps} chartLabel='Temperature in °F' legendLabel='Thermometer'/>
            
            <LineGraph data={humidity} labels={timeStamps} chartLabel='Relative Humidity %' legendLabel='Hygrometer' />
            
            <LineGraph data={moistureLevel} labels={timeStamps} chartLabel='Moisture Level' legendLabel='Moisture' />
            
            <LineGraph data={pressure} labels={timeStamps} chartLabel='Pressure in kPa' legendLabel='Barometer' />

          </div>
          
      </div>
    );
  }
}

