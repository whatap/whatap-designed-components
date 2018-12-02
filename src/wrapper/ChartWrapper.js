import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ChartCollection } from '../Chart'

// ChartWrapper.propTypes = {
//   id: PropTypes.number.isRequired,
//   type: PropTypes.oneOf(['LineChart']),
//   showLegend: PropTypes.bool,
// }
// ChartWrapper.defaultProps = {
//   type: 'LineChart',
//   showLegend: false
// }

function objectCompare (object1, object2) {
  // Return if value is not an object
  if (typeof object1 !== 'object' || typeof object2 !== 'object') return ;
  return JSON.stringify(object1) === JSON.stringify(object2);
}

class ChartWrapper extends Component{
  constructor(props) {
    super(props)

    this.setDiv = element => {
      this.mainDiv = element;
    }
  }

  componentDidMount() {
    let that = this;
    const { type, id, colorId, mediator } = this.props;

    this.chart = new ChartCollection[type](id, colorId);
    
    if ( mediator ) {
      console.log(mediator);
      mediator.subscribe(this.chart);
    }
    
    if ( this.props.data ) {
      this.chart.loadData(this.props.data);
    }
    
    window.addEventListener("resize", that.resizeCanvas, false);
    this.resizeCanvas();
    
    this.chart.drawChart();
  }

  componentWillReceiveProps(nextProps) {
    if (typeof nextProps.data !== 'undefined'
    && !objectCompare(this.props.data, nextProps.data)) {
      console.log("으잉?")
      this.chart.loadData(nextProps.data);
    }
    if (typeof nextProps.updateData !== 'undefined' 
    && nextProps.updateData.length > 0
    && !objectCompare(this.props.updateData, nextProps.updateData)) {
      console.log(nextProps.updateData);
      this.chart.updateData(nextProps.updateData);
    }
  }

  // shouldComponentUpdate(nextProps) {

  // }

  resizeCanvas = () => {
    this.chart.resizeCanvas(this.mainDiv);
    this.chart.drawChart();
  }

  render() {
    const { id, showLegend } = this.props;
    console.log(showLegend);
    return (
      <div ref={this.setDiv} style={{ width: '100%' }}>
        <canvas id={id}/>
        { showLegend 
        ? <div>
            Hello, World!
          </div>
        : undefined}
      </div>
    )
  }
}

export default ChartWrapper;