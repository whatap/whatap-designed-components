import React, { Component } from 'react';
import { LineChart } from './wdc'

class App extends Component {
  componentDidMount() {
    this.lineChart1 = new LineChart("test01");
    this.lineChart2 = new LineChart("test02");
    this.lineChart3 = new LineChart("test03");
    this.lineChart4 = new LineChart("test04");
    this.lineChart5 = new LineChart("test05");
    this.lineChart6 = new LineChart("test06");

    this.dataset1 = this.createDataset();
    this.dataset2 = this.createDataset();
    this.dataset3 = this.createDataset();
    this.dataset4 = this.createDataset();
    this.dataset5 = this.createDataset();
    this.dataset6 = this.createDataset();

    this.lineChart1.loadData(this.dataset1);
    this.lineChart1.drawChart();

    this.lineChart2.loadData(this.dataset2);
    this.lineChart2.drawChart();

    this.lineChart3.loadData(this.dataset3);
    this.lineChart3.drawChart();

    this.lineChart4.loadData(this.dataset4);
    this.lineChart4.drawChart();

    this.lineChart5.loadData(this.dataset5);
    this.lineChart5.drawChart();

    this.lineChart6.loadData(this.dataset6);
    this.lineChart6.drawChart();
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
        <canvas id="test01" width="450" height="300"/>
        <canvas id="test02" width="450" height="300"/>
        <canvas id="test03" width="450" height="300"/>
        <canvas id="test04" width="450" height="300"/>
        <canvas id="test05" width="450" height="300"/>
        <canvas id="test06" width="450" height="300"/>
      </div>
    );
  }
}

export default App;
