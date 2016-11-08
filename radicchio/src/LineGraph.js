import React from 'react';
import { Line, defaults } from 'react-chartjs-2';

defaults.global.defaultFontColor = '#FFF';

export default React.createClass({

  render() {
    const options = {
      legend: {
        display: false,
      },
      scales: {
        xAxes: [{
          gridLines: {
            color: '#ADB2BA'
          },
        }],
        yAxes: [{
          gridLines: {
            color: '#ADB2BA'
          },
        }]
      },
    }

    const data = {
      labels: this.props.labels,
      datasets: [
        {
          label: this.props.legendLabel,
          legend: false,
          fill: true,
          lineTension: 0.1,
          backgroundColor: 'rgba(58,222,232,0.7)',
          borderColor: '#3BFFAB',
          borderCapStyle: 'butt',
          borderDash: [],
          borderDashOffset: 0.0,
          borderJoinStyle: 'miter',
          pointBorderColor: '#3BFFAB',
          pointBackgroundColor: '#ffebcd',
          pointBorderWidth: 1,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: 'rgba(238,76,118,1)',
          pointHoverBorderColor: 'rgba(220,220,220,1)',
          pointHoverBorderWidth: 2,
          pointRadius: 1,
          pointHitRadius: 10,
          data: this.props.data,
        }
      ]
    };

    return (
      <div className="LineGraph">
        <p className="ChartLabel">{this.props.chartLabel}</p>
        <Line data={data} options={options} />
      </div>
    );
  }
});