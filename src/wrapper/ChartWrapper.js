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

    this.setCanvas = element => {
      this.canvasRef = element;
    }

  }

  componentDidMount() {
    let that = this;
    const { type, id, colorId, mediator, options } = this.props;

    this.chart = new ChartCollection[type](id, colorId, options);
    
    if ( mediator ) {
      mediator.subscribe(this.chart);
    }
    
    if ( this.props.data ) {
      this.chart.loadData(this.props.data);
    }
    
    window.addEventListener("resize", that.resizeCanvas, false);
    setTimeout(() => {
      that.resizeCanvas();
    }, 100);

    this.chartInitSizing = setInterval(() => {
      try {
        if (that.mainDiv.clientWidth !== that.canvasRef.clientWidth) {
          that.resizeCanvas();
        } else {
          clearInterval(that.chartInitSizing);
        }
      } catch (e) {
        console.log("Resizing error");
        clearInterval(that.chartInitSizing);
      } 
    }, 100);
    
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

  resizeCanvas = () => {
    // this.chart.resizeCanvasWithSize(size.width, size.height);
    this.chart.resizeCanvas(this.mainDiv);
    this.chart.drawChart();
  }

  render() {
    let that = this;
    const { id, showLegend, cvHeight, cvWidth } = this.props;
    
    return (
      <div ref={that.setDiv}>
        <canvas ref={that.setCanvas} id={id} style={{ width: cvWidth || "100%", height: cvHeight || "300px" }}/>
          {/* { showLegend 
          ? <div>
              Hello, World!
            </div>
          : undefined} */}
      </div>
    )
  }
}

export default ChartWrapper;