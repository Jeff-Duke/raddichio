import React from 'react';
import {Line} from 'react-chartjs-2';

export default React.createClass({
  displayName: 'Temperature in °F',

  render() {
    const data = {
      labels: this.props.labels,
      datasets: [
        {
          label: this.props.legendLabel,
          fill: true,
          lineTension: 0.1,
          backgroundColor: 'rgba(58,222,232,0.4)',
          borderColor: 'rgba(40,155,194,1)',
          borderCapStyle: 'butt',
          borderDash: [],
          borderDashOffset: 0.0,
          borderJoinStyle: 'miter',
          pointBorderColor: 'rgba(75,192,192,1)',
          pointBackgroundColor: '#fff',
          pointBorderWidth: 1,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: 'rgba(75,192,192,1)',
          pointHoverBorderColor: 'rgba(220,220,220,1)',
          pointHoverBorderWidth: 2,
          pointRadius: 1,
          pointHitRadius: 10,
          data: this.props.data
        }
      ]
    };

    return (
      <div className="LineGraph">
        <p>{this.props.chartLabel}</p>
        <Line data={data} />
      </div>
    );
  }
});