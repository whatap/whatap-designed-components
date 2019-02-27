import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ChartCollection, LineChart } from '../../Chart'

function objectCompare (object1, object2) {
  // Return if value is not an object
  if (typeof object1 !== 'object') {
    object1 = {};
  }
  if (typeof object2 !== 'object') return ;
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
    const { type, id, options, manipulator, data, chartRef, theme, customTheme, chartMouseClick} = this.props;

    this.chart = new ChartCollection[type](id, options);

    if ( chartRef ) {
      chartRef(this.chart);
    }

    if ( chartMouseClick ) {
      this.chart.chartMouseClick = chartMouseClick;
    }
    
    if ( data ) {
      this.rawData = data;
      if ( manipulator) {
        this.data = manipulator(this.rawData);
      } else {
        this.data = data;
      }
      this.chart.loadData(this.data)
    }

    if ( customTheme ) {
      this.chart.addTheme(customTheme);
    }
    
    window.addEventListener("resize", that.resizeCanvas, false);
    setTimeout(() => {
      that.resizeCanvas();
    }, 100);

    // this.chartInitSizing = setInterval(() => {
    //   try {
    //     if (that.mainDiv.clientWidth !== that.canvasRef.clientWidth) {
    //       that.resizeCanvas();
    //     } else {
    //       clearInterval(that.chartInitSizing);
    //     }
    //   } catch (e) {
    //     console.log("Resizing error");
    //     clearInterval(that.chartInitSizing);
    //   } 
    // }, 1);

    this.mainDivWidth = this.mainDiv.clientWidth;
    this.mainDivHeight = this.mainDiv.clientHeight;
    /**
     * Circumventing a bug
     */
    this.chartInitSizing = setInterval(() => {
      try {
        if (that.mainDivWidth !== that.mainDiv.clientWidth
          || that.mainDivHeight !== that.mainDiv.clientHeight) {

          if (that.mainDiv.clientWidth === 0
            || that.mainDiv.clientHeight === 0) {
              /**
               * V 0.8.5
               * prevent rerendering causing trouble
               */
              clearInterval(that.chartInitSizing);
          } else {
            that.resizeCanvas();
            that.mainDivWidth = that.mainDiv.clientWidth;
            that.mainDivHeight = that.mainDiv.clientHeight;
          }

        }
      } catch (e) {
        console.log("Resizing error");
      }
    }, 200);

    this.chart.setTheme(theme);
    this.chart.drawChart();
  }

  componentWillReceiveProps(nextProps) {
    const { manipulator } = this.props;
    if (typeof nextProps.data !== 'undefined'
      && !objectCompare(this.rawData, nextProps.data)) {
      this.rawData = nextProps.data;
      if ( manipulator ) {
        this.data = manipulator(this.rawData);
      } else {
        this.data = nextProps.data;
      }

      this.chart.loadData(this.data);
    }

    if (typeof nextProps.updateData !== 'undefined' 
    && !objectCompare(this.rawUpdateData, nextProps.updateData)) {
      this.rawUpdateData = nextProps.updateData;
      if ( manipulator ) {
        this.updateData = manipulator(this.rawUpdateData);
      } else {
        this.updateData = nextProps.updateData;
      }
      this.chart.updateData(this.updateData);
    }

    if (!objectCompare(this.props.options, nextProps.options)) {
      this.chart.updateOptions(nextProps.options);
    }

    if (this.props.theme !== nextProps.theme) {
      this.chart.setTheme(nextProps.theme, true);
    }

    if (this.props.chartRef !== nextProps.chartRef) {
      nextProps.chartRef(this.chart);
    }

    return false;

  }

  resizeCanvas = () => {
    const { cvHeight } = this.props;
    // this.chart.resizeCanvasWithSize(size.width, size.height);
    this.chart.resizeCanvas(this.mainDiv, cvHeight);
    this.chart.drawChart();
  }

  render() {
    let that = this;
    const { id, showLegend, cvHeight, cvWidth } = this.props;
    
    return (
      <div ref={that.setDiv} style={{ width: "100%", height: "100%"}} >
        <canvas ref={that.setCanvas} id={id} style={{ width: cvWidth || "100%", height: cvHeight || "100%" }}/>
      </div>
    )
  }

  componentWillUnmount() {
    clearInterval(this.chartInitSizing);
    delete this.chart;
  }
  
}

export default ChartWrapper;