/**
 * WhaTap LineChart
 * created by MinGu Lee (@immigration9)
 * All rights reserved to WhaTap Labs 2018
 */
import { LinkedMap } from '../core';
import { Palette } from '../Palette'

const default_options = {
  xAxis: {
    maxPlot: 600
  }
}

class LineChart extends WChart{
  constructor(bind_id, color_id, options) {
    super();
    this.init(bind_id);
    this.initOptions(options);
    this.initCanvas();

    this.palette = new Palette(color_id);
  }

  init = (bind_id) => {
    this.canvas = document.getElementById(bind_id);
    this.ctx = this.canvas.getContext("2d");
    this.data = new LinkedMap();
  }

  initOptions = (options) => {
    this.config = { ...default_options, ...options };
  }

  initCanvas = () => {
    this.wSetBoundingClientRect(this.canvas);
    this.wSetScreenRatio();

    let width = this.bcRect.width;
    let height = this.bcRect.height;

    this.canvas.width = width * this.ratio;
    this.canvas.height = height * this.ratio;
    this.canvas.style.width = (width) + "px";
    this.canvas.style.height = (height) + "px";
    this.ctx.scale(this.ratio, this.ratio);
  }

  loadData = (dataset) => {
    if (!dataset) return;
    let that = this;

    dataset.map((ds) => {
      let color_value = that.palette.getColorFromOid(ds.oid);
      that.data.put(ds.oid, { oname: ds.oname, data: ds.data, color: color_value });
    })
  }

  updateData = (dataset) => {
    if (!dataset) return;
    let that = this;

    dataset.map((ds) => {
      if (that.data.containsKey(ds.oid)) {
        let c_data = that.data.get(ds.oid);
        ds.data.map((datum) => {
          c_data.data.push(datum);
        })
        if (c_data.data.length > this.config.xAxis.maxPlot) {
          let overflow = c_data.data.length - this.config.xAxis.maxPlot;
          c_data.data = c_data.data.slice(overflow);
        }
      } else {
        let color_value = that.palette.getColorFromOid(ds.oid);
        that.data.put(ds.oid, { oname: ds.oname, data: ds.data, color: color_value });
      }
    })
  }
 
  resetData = () =>{
    this.data.clear();
  }

  drawChart = () => {
    this._drawBackground();
    this._drawAxis();
    this._drawData();
    this._drawLabel();
  }

  /**
   * @private
   */
  _drawAxis = () => {

  }
  /**
   * @private
   */
  _drawBackground = () => {

  }

  /**
   * @private
   */
  _drawData = () => {
    let that = this;
    let ctx = this.ctx;
    ctx.clearRect(0, 0, this.bcRect.width, this.bcRect.height);

    
  }

  /**
   * @private
   */
  _drawLabel = () => {

  }

  
}

export default LineChart;