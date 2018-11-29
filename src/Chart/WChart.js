import { mergeDeep } from './util/mergeDeep';
import defaultOptions from './option/lineChartDefault';
import { Palette } from '../Palette';
import { LinkedMap, HeapSort } from '../core';
import { drawXplot, drawYplot, drawXaxis, drawYaxis } from './helper/drawBorder';
import { drawXtick, drawYtick } from './helper/drawTick';

export default class WChart {
  constructor(bindId, colorId, options) {
    this.init(bindId, colorId);
    this.initOptions(options);
    this.initCanvas();
    this.initUtils();
  }

  wGetBoundingClientRect = (element) => {
    if ( this.bcRect === null || typeof this.bcRect === 'undefined' ) {
      this.bcRect = element.getBoundingClientRect();
    }
		return this.bcRect;
  }

  overrideClientRect = () => {
    this.bcRect = this.canvas.getBoundingClientRect();
    return this.bcRect;
  }

  wGetScreenRatio = () => {
    if ( this.ratio === null || typeof this.ratio === 'undefined' ) {
      this.ratio = window.devicePixelRatio;
    }
    if (this.ratio < 2) {
      this.ratio = 2;
    }
  }

  clearClientRect = () => {
    this.bcRect = null;
  }

  clearScreenRatio = () => {
    this.ratio = null;
  }

  init = (bindId, colorId) => {
    this.chartId = bindId;
    this.canvas  = document.getElementById(bindId);
    this.ctx     = this.canvas.getContext("2d");
    this.data    = new LinkedMap();
    this.palette = new Palette(colorId);

    this.chartAttr = {
      x: 0,
      y: 0,
      w: 0,
      h: 0,
    }
		this.dots = [];
		this.tooltipOn = false;
  }

  initOptions = (options) => {
    this.config    = mergeDeep(defaultOptions, options);
    this.startTime = this.config.xAxis.startTime;
    this.endTime   = this.config.xAxis.endTime;
  }

  initCanvas = () => {
    this.wGetBoundingClientRect(this.canvas);
    this.wGetScreenRatio();

    let width  = this.bcRect.width;
    let height = this.bcRect.height;

    this.canvas.width        = width * this.ratio;
    this.canvas.height       = height * this.ratio;
    this.canvas.style.width  = (width) + "px";
    this.canvas.style.height = (height) + "px";

    this.ctx.scale(this.ratio, this.ratio);
  }

  initUtils = () => {
    this.heapSort = new HeapSort();
  }

  drawPreBackground = () => {
    this._drawBackground();
    this._drawPlot();
  }

  drawPostBackground = () => {
    this._drawAxis();
    this._drawLabel();
  }

  /**
   * @private
   */
  _drawBackground = () => {
    let that   = this;
    let ctx    = this.ctx;
    let width  = this.bcRect.width;
    let height = this.bcRect.height;
    let plots  = this.plots;
    ctx.clearRect(0, 0, width, height);

    ctx.font = "8px Verdana";
    ctx.save();

    let yAxisMax = this.config.yAxis.tickFormat(this.config.yAxis.maxValue);
    this.chartAttr.x = parseInt(ctx.measureText(yAxisMax).width) + 5;
    this.chartAttr.y = 5;
    this.chartAttr.w = width - this.chartAttr.x;
    this.chartAttr.h = height - this.chartAttr.y - 20;
    
    ctx.fillStyle = "rgba(0,0,0,0)";
    ctx.fillRect(0, 0, width, height);

    // ctx.fillStyle = "rgb(50,100,100)";
    // ctx.fillRect(this.chartAttr.x, this.chartAttr.y, this.chartAttr.w, this.chartAttr.h);
  }

  _drawPlot = () => {
    let that      = this;
    let ctx       = this.ctx;
    let width     = this.bcRect.width;
    let height    = this.bcRect.height;
    let config    = this.config;
    let startTime = this.startTime;
    let endTime   = this.endTime;
    let chartAttr = this.chartAttr;
    const { x, y, w, h } = chartAttr;
    const { interval, maxPlot, plotLine: xPlotLine, axisLine: xAxisLine } = config.xAxis;
    const { maxValue, minValue, plotLine: yPlotLine, axisLine: yAxisLine } = config.yAxis;

    const xOptions = {
      format: "HH:mm:ss",
      minOffset: 3,
      chartAttr, startTime, endTime, xPlotLine, xAxisLine
    }
    const yOptions = { 
      chartAttr, maxValue, minValue, yPlotLine, yAxisLine,
      plots: config.yAxis.plots
    } 

    /**
     * Plot gridline
     */
    if (config.xAxis.plotLine.display) drawXplot(ctx, xOptions);
    if (config.yAxis.plotLine.display) drawYplot(ctx, yOptions);
  }

  /**
   * @private
   */
  _drawAxis = () => {
    let that      = this;
    let ctx       = this.ctx;
    let width     = this.bcRect.width;
    let height    = this.bcRect.height;
    let config    = this.config;
    let startTime = this.startTime;
    let endTime   = this.endTime;
    let chartAttr = this.chartAttr;
    const { x, y, w, h } = chartAttr;
    const { interval, maxPlot, plotLine: xPlotLine, axisLine: xAxisLine } = config.xAxis;
    const { maxValue, minValue, plotLine: yPlotLine, axisLine: yAxisLine } = config.yAxis;

    const xOptions = {
      format: "HH:mm:ss",
      minOffset: 3,
      chartAttr, startTime, endTime, xPlotLine, xAxisLine
    }
    const yOptions = { 
      chartAttr, maxValue, minValue, yPlotLine, yAxisLine,
      plots: config.yAxis.plots
    } 

    /**
     * Plot gridline
     */
    if (config.xAxis.plotLine.display) drawXplot(ctx, xOptions);
    if (config.yAxis.plotLine.display) drawYplot(ctx, yOptions);

    /**
     * Tick labels: xAxis & yAxis
     */
    if (config.xAxis.tick.display)     drawXtick(ctx, xOptions);
    if (config.yAxis.tick.display)     drawYtick(ctx, yOptions);

    /**
     * Outer gridline & Tick labels
     */
    if (config.xAxis.axisLine.display) drawXaxis(ctx, xOptions);
    if (config.yAxis.axisLine.display) drawYaxis(ctx, yOptions);
  }

  /**
   * @private
   */
  _drawLabel = () => {
		if (typeof this.tooltip === 'undefined') {
			this.tooltip = document.createElement('div');
			document.body.appendChild(this.tooltip);
		}
  }

  resizeCanvas = (element) => {
    this.bcRect = {
      ...this.bcRect,
      width: element.clientWidth - 10,
      height: element.clientHeight,
    }

    this.setDpiSupport();
  }

  setDpiSupport = () => {
    const canvas = this.canvas;
    const ratio  = this.ratio;
    const ctx    = this.ctx;
    const { width, height } = this.bcRect;

    canvas.width = width * ratio;
    canvas.height = height * ratio;
    canvas.style.width = width + "px";
    canvas.style.height = height + "px";
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  }

}
