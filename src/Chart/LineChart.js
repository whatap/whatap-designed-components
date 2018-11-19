/**
 * WhaTap LineChart
 * created by MinGu Lee (@immigration9)
 * All rights reserved to WhaTap Labs 2018
 */
import { LinkedMap } from '../core';
import { Palette } from '../Palette';
import WChart from './WChart';

const UNIX_TIMESTAMP = 1000;
const MINUTE_IN_SECONDS = 60;

const default_options = {
  xAxis: {
    maxPlot: 600,
    interval: 60,
    axisLine: {
      display: true,
      color: '#000000',
    },
    plotLine: {
      display: true,
      color: '#d9e2eb'
    },
    tick: {
      display: true,
      color: '#000000'
    },
    isFixed: false,
    startTime: (new Date().getTime()) - (UNIX_TIMESTAMP * MINUTE_IN_SECONDS * 10),
    endTime: new Date().getTime(),
  },
  yAxis: {
    tickFormat: function (d) {
      return d;
    },
    plots: 4,
    maxValue: 1000,
    minValue: 0,
    axisLine: {
      display: true,
      color: '#000000'
    },
    plotLine: {
      display: true,
      color: '#d9e2eb'
    },
    tick: {
      display: true,
      color: '#000000'
    }
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

    this.chart_attr = {
      x: 0,
      y: 0,
      w: 0,
      h: 0,
    }
  }

  initOptions = (options) => {
    this.config = { ...default_options, ...options };

    this.start_time = this.config.xAxis.startTime;
    this.end_time = this.config.xAxis.endTime;
  }

  initCanvas = () => {
    this.wSetBoundingClientRect(this.canvas);
    this.wSetScreenRatio();

    let width = this.bc_rect.width;
    let height = this.bc_rect.height;

    this.canvas.width = width * this.ratio;
    this.canvas.height = height * this.ratio;
    this.canvas.style.width = (width) + "px";
    this.canvas.style.height = (height) + "px";
    this.ctx.scale(this.ratio, this.ratio);
  }

  loadData = (dataset) => {
    if (!dataset) return;
    let that = this;
    let config = this.config;

    dataset.map((ds, idx) => {
      let color_value = that.palette.getColorFromOid(ds.oid);
      that.data.put(ds.oid, { oname: ds.oname, data: ds.data, color: color_value });
      /**
       * Only get the initial start time when the option is set to `isFixed=true`
       */
      if (config.xAxis.time.isFixed) {
        if (idx === 0) {
          that.start_time = ds.data[0][0];
        } else {
          if (that.start_time > ds.data[idx][0]) {
            that.start_time = ds.data[idx][0];
          }
        }
      }
      
    })
  }

  updateData = (dataset) => {
    if (!dataset) return;
    let that = this;
    const { maxPlot } = this.config.xAxis;

    dataset.map((ds) => {
      if (that.data.containsKey(ds.oid)) {
        let c_data = that.data.get(ds.oid);
        ds.data.map((datum) => {
          c_data.data.push(datum);
        })
        if (c_data.data.length > maxPlot) {
          let overflow = c_data.data.length - maxPlot;
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
  _drawBackground = () => {
    let that = this;
    let ctx = this.ctx;
    let width = this.bc_rect.width;
    let height = this.bc_rect.height;
    let plots = this.plots;
    ctx.clearRect(0, 0, width, height);

    ctx.font = "8px Verdana";
    ctx.save();

    let y_axis_max = this.config.yAxis.tickFormat(this.config.yAxis.maxValue);
    this.chart_attr.x = parseInt(ctx.measureText(y_axis_max).width) + 5;
    this.chart_attr.y = 5;
    this.chart_attr.w = width - this.chart_attr.x;
    this.chart_attr.h = height - this.chart_attr.y - 20;
    
    ctx.fillStyle = "rgba(0,0,0,0)";
    ctx.fillRect(0, 0, width, height);

    // ctx.fillStyle = "rgb(50,100,100)";
    // ctx.fillRect(this.chart_attr.x, this.chart_attr.y, this.chart_attr.w, this.chart_attr.h);
  }

  /**
   * @private
   */
  _drawAxis = () => {
    let that = this;
    let ctx = this.ctx;
    let width = this.bc_rect.width;
    let height = this.bc_rect.height;
    let config = this.config;
    const { x, y, w, h } = this.chart_attr;
    const { interval, maxPlot } = config.xAxis;

    /**
     * Plot gridline
     */
    if (config.xAxis.plotLine.display) {
      let draw_plots = maxPlot / interval;
      let width_interval = w / draw_plots;
      for (let i = 1; i < draw_plots; i++) {
        ctx.beginPath();
        ctx.setLineDash([1, 2]);
        ctx.strokeStyle = config.xAxis.plotLine.color;
        ctx.moveTo(x + (i * width_interval), y);
        ctx.lineTo(x + (i * width_interval), y + h);
        ctx.stroke();
      }
    }

    if (config.yAxis.plotLine.display) {
      let height_interval = h / config.yAxis.plots;
      for (let i = 0; i < config.yAxis.plots; i++) {
        ctx.beginPath();
        ctx.setLineDash([1, 2]);
        ctx.strokeStyle = config.yAxis.plotLine.color;
        ctx.moveTo(x, y + (i * height_interval));
        ctx.lineTo(x + w, y + (i * height_interval));
        ctx.stroke();
      }
    }

    /**
     * Tick labels
     * TODO: Change demo to actual data;
     */
    if (config.xAxis.tick.display) {
      let draw_plots = maxPlot / interval;
      let width_interval = w / draw_plots;
      for (let i = 1; i < draw_plots; i++) {
        ctx.restore();
        ctx.fillText("00:00", x + (i * width_interval) - 12, y + h + 9);
      }

    }

    if (config.yAxis.tick.display) {
      let height_interval = h / config.yAxis.plots;
      let { maxValue } = config.yAxis;
      let tick_value = maxValue;
      for (let i = 0; i < config.yAxis.plots + 1; i++) {
        ctx.textAlign = "right";
        ctx.fillText(tick_value, x - 2, (y + 3) + (i * height_interval));
        tick_value -= (maxValue / (config.yAxis.plots));
      }
    }

    /**
     * Outer gridline & Tick labels
     */
    if (config.xAxis.axisLine.display) {
      ctx.beginPath();
      ctx.strokeStyle = config.xAxis.axisLine.color;
      ctx.moveTo(x, y + h);
      ctx.lineTo(x + w, y + h);
      ctx.stroke();
    }
    if (config.yAxis.axisLine.display) {
      ctx.beginPath();
      ctx.strokeStyle = config.yAxis.axisLine.color;
      ctx.moveTo(x, y);
      ctx.lineTo(x, y + h);
      ctx.stroke();
    }
  }

  /**
   * @private
   */
  _drawData = () => {
    let that = this;
    let ctx = this.ctx;
    const { x, y, w, h } = this.chart_attr;
    const { minValue, maxValue } = this.config.yAxis;
    
    let en = this.data.keys();
    while(en.hasMoreElements()) {
      let key = en.nextElement();
      let value = this.data.get(key);

      value.data.map((datum, idx) => {
        if (datum[0] < this.start_time || datum[0] > this.end_time ) return;
        let x_pos = (datum[0] - this.start_time) / (this.end_time - this.start_time);
        let x_coord = x + (w * x_pos);

        let y_pos = 1;
        if ( datum[1] > minValue ) {
          if ( datum[1] > maxValue ) {
            y_pos = 0;
          } else {
            y_pos = 1 - (datum[1] - minValue) / (maxValue - minValue);
          }
        }
        let y_coord = y + (h * y_pos);

        ctx.fillStyle = "#333333";
        ctx.fillRect(x_coord, y_coord, 1, 1);

        /**
         * plot과 plot을 이어주는 line
         */
        if (idx === 0) {
          ctx.beginPath();
          ctx.strokeStyle = value.color;
          ctx.moveTo(x_coord, y_coord);
        } else {
          ctx.lineTo(x_coord, y_coord);
          ctx.stroke();

          ctx.beginPath();
          ctx.moveTo(x_coord, y_coord);
        }
      })
    }
  }

  /**
   * @private
   */
  _drawLabel = () => {

  }

  
}

export default LineChart;