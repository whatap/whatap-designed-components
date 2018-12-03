import ChartMediator from '../mediator/ChartMediator';

class PublicLegend {
  constructor() {
    this.mediator = ChartMediator;

    this.dataset = [];
  }
  notifyMediator = (action, arg) => {
    if (typeof this.mediator[action] !== 'undefined') {
      this.mediator[action](arg);
    }
  }

  loadData = (dataset) => {
    let length = dataset.length;
    for (let i = 0; i < length; i++) {
      let data = dataset[i];
      let exists = this.dataset.find((ds) => {
        return ds.oid === data.oid;
      });
      if (typeof exists === 'undefined') {
        this.dataset.push({ 
          oid: data.oid, 
          oname: data.oname, 
          focus: true
        });
      }
    }
  }

  updateData = (dataset) => {
    let length = dataset.length;
    for (let i = 0; i < length; i++) {
      let data = dataset[i];
      let exists = this.dataset.find((ds) => {
        return ds.oid === data.oid;
      });
      if (typeof exists === 'undefined') {
        this.dataset.push({ 
          oid: data.oid, 
          oname: data.oname, 
          focus: true
        });
      }
    }
  }

  handleClick = (oid) => {
    let data = this.dataset.find((ds) => {
      return ds.oid === oid;
    })

    this.notifyMediator('clicked', data);
  }

}

export default PublicLegend;