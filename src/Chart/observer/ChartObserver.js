
import WChart from '../WChart';

class ChartObserver {
  constructor() {
    this.subscribers = [];
  }

  subscribe(chart) {
    if (chart instanceof WChart) {
      this.subscribers.push(chart);
    }
  }

  unsubscribe(id) {
    this.subscribers.filter(chart => chart.chartId !== id);
  }

  notify(fn) {
    if (typeof fn === 'function') {
      this.subscribers.forEach((subscriber) => {
        subscriber[fn]();
      })
    } else {
      throw new Error("You must provide a valid function to execute");
    }
  }

}

export default ChartObserver;