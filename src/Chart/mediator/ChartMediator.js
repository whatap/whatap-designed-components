import WChart from '../WChart';
class ChartMediator {
  constructor() {
    if (this.instance) {
      return this.instance;
    }
    this.hash = Math.random() * 1000;
    this.instance = this;
    this.charts = [];
  }
  subscribe = (chart) => {
    this.charts.push(chart);
    // if (chart instanceof WChart) {
    //   console.log("subscribed");
    // } else {
    //   throw new Error("Please provide an instance of WChart");
    // }
  }

  unsubscribe = (chart) => {
    let charts = this.charts;
    let length = charts.length;
    for (let i = 0; i < length; i++) {
      if (charts[i] === chart) {
        charts.splice(i, 1);
      }
    }
  }
  unsubscribeAll = () => {
    this.charts = [];
  }
  clicked = (func, data) => {
    let charts = this.charts;
    let length = charts.length;
    for (let i = 0; i < length; i++) {
      let chart = charts[i];
      if (typeof chart[func] === "function") {
        chart[func](data);
      }
    }
  }
}

const instance = new ChartMediator();
Object.freeze(instance);
export default instance;