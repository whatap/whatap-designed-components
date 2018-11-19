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
    
    let data_out1 = this.createTimedata(119);
    let data_out2 = this.createTimedata(59);
    out.push({ oid: 12345, oname: "hello", data: data_out1});
    out.push({ oid: 23456, oname: "world", data: data_out2});
    console.log(out);
    return out;
  }

  createTimedata = (count) => {
    let out = [];

    for (let i = count; i >= 0; i--) {
      let input = [];
      let time = parseInt(new Date().getTime() / 1000);
      let timestamp = (time * 1000)  - (i * 5 * 1000);
      input.push(timestamp);
      input.push(Math.random() * Math.random() * 100);

      out.push(input);
    }
    return out;
  }

  render() {
    return (
      <div className="App">
        <canvas id="test01" width="800" height="400"/>
      </div>
    );
  }
}

export default App;
