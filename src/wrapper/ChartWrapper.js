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
//   showLegend: false,
//   options: {}
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
    const { type, id, colorId, mediator, options } = this.props;

    this.chart = new ChartCollection[type](id, colorId, options);
    
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
    const { dataId } = this.props;
    if (typeof nextProps.data !== 'undefined'
    && !objectCompare(this.props.data, nextProps.data)) {
      this.chart.loadData(nextProps.data, dataId);
    }
    if (typeof nextProps.updateData !== 'undefined' 
    && nextProps.updateData.length > 0
    && !objectCompare(this.props.updateData, nextProps.updateData)) {
      this.chart.updateData(nextProps.updateData, dataId);
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
    
    return (
      <div ref={this.setDiv} style={{ width: '100%', height: '100%' }}>
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