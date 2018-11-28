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
    if (chart instanceof WChart) {
      this.charts.push(chart);
      console.log("subscribed");
    } else {
      throw new Error("Please provide an instance of WChart");
    }
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
  clicked = (data) => {
    let charts = this.charts;
    let length = charts.length;
    for (let i = 0; i < length; i++) {
      charts[i].drawSelected(data);
    }
  }
}

const instance = new ChartMediator();
Object.freeze(instance);
export default instance;