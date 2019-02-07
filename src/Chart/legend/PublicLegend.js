import ChartObserver from '../observer/ChartObserver';

class PublicLegend {
  constructor() {
    this.chartObserver = ChartObserver.instance;
    this.subscribeObserver();

    this.dataset = [];
  }

  subscribeObserver = () => {
    this.chartObserver.subscribe("clicked", this.drawSelectedGlobal, this);
  }

  drawSelectedGlobal = (dots) => {
    this.focused = dots;
    this.setData();
  } 

  notifyObserver = (eventName, data) => {
    this.chartObserver.notify(eventName, data);
  }

  loadData = (dataset) => {
    let length = dataset.length;
    for (let i = 0; i < length; i++) {
      let data = dataset[i];
      let exists = this.dataset.find((ds) => {
        return ds.id === data.id;
      });
      if (typeof exists === 'undefined') {
        this.dataset.push({ 
          id: data.id, 
          label: data.label,
          focused: true
        });
      }
    }
  }

  setData = () => {
    let that = this;
    this.dataset = this.dataset.map((ds) => {
      if (that.focused.find(f => f.id === ds.id)) {
        return { ...ds, focused: true }
      } else {
        return { ...ds, focused: false}
      }
    })
  }

  handleClick = (id) => {
    let data = this.dataset.filter((ds) => {
      return ds.id === id;
    })

    this.chartObserver.notify("clicked", data);
  }

}

export default PublicLegend;