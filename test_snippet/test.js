import React, { Component } from 'react';
import { LineChart } from './wdc'

class App extends Component {
  componentDidMount() {
    this.lineChart = new LineChart("test01");

    this.dataset = this.createDataset();
    this.lineChart.loadData(this.dataset);
    this.lineChart.drawChart();
  }

  createDataset = () => {
    let out = [];
    
    let data_out = this.createTimedata();
    out.push({ oid: 12345, oname: "hello", data: data_out});
    out.push({ oid: 23456, oname: "world", data: data_out});
    out.push({ oid: 34567, oname: "mingu", data: data_out});

    return out;
  }

  createTimedata = () => {
    let out = [];

    for (let i = 119; i >= 0; i++) {
      let input = [];
      let timestamp = new Date().getTime() - (i * 5 * 1000);
      input.push(timestamp);
      input.push(Math.random() * 100);

      out.push(input);
    }
    return out;
  }

  render() {
    return (
      <div className="App">
        <canvas id="test01" />
      </div>
    );
  }
}

export default App;
