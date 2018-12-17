import { mergeDeep } from './util/mergeDeep';
import defaultOptions from './option/lineChartDefault';
import { Palette } from '../Palette';
import { LinkedMap, HeapSort } from '../core';
import { drawXplot, drawYplot, drawXaxis, drawYaxis } from './helper/drawBorder';
import { drawXtick, drawYtick } from './helper/drawTick';
import Tooltip, { drawTooltipCircle } from './helper/drawTooltip';
import moment from 'moment';
import { getMousePos } from './helper/mouseEvt'
import ChartMediator from './mediator/ChartMediator';
import { ttCalcX, ttRange } from './util/positionCalc';
import { calculateFormat } from './meta/plotMeta';

class WChart {
  constructor(bindId, colorId, options) {
    this.init(bindId, colorId);
    this.initOptions(options);
    this.initCanvas();

    this.initListener();
    this.initUtils();

    this.focused  = undefined;
    this.mediator = ChartMediator;
  }

  notifyMediator = (action, arg) => {
    if (typeof this.mediator[action] !== 'undefined') {
      this.mediator[action](arg);
    }
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

  initListener = () => {
    this.tooltip = new Tooltip();
    this.canvas.addEventListener("mouseover", this.handleMouseOver);
    this.canvas.addEventListener("mousemove", this.handleMouseMove);
    this.canvas.addEventListener("mouseout", this.handleMouseOut);
    this.canvas.addEventListener("click", this.handleMouseClick);
  }

  handleMouseOver = (evt) => {
    let mousePos = getMousePos(evt, this.overrideClientRect());
    
    let textOutput = this.findTooltipData(mousePos);

    if (textOutput !== null) {
      this.mouseFollow = true;
      this.tooltip.append(evt, textOutput);
    }
  }

  handleMouseMove = (evt) => {
    let mousePos = getMousePos(evt, this.overrideClientRect());

    let textOutput = this.findTooltipData(mousePos);

    if (textOutput !== null) {
      this.mouseFollow = true;
      if (this.tooltip.tooltipOn) {
        this.tooltip.follow(evt, textOutput);
      } else {
        this.tooltip.append(evt, textOutput);
      }
    } else {
      if (!this.mouseFollow) {
        this.tooltip.remove();
      }
    }
  }

  handleMouseOut = (evt) => {
    this.mouseFollow = false;
    this.tooltip.remove();
  }

  handleMouseClick = (evt) => {
    let mousePos = getMousePos(evt, this.overrideClientRect());
		let { mx, my } = mousePos;
    let max = this.dots.length;
    let startTime = this.startTime;
    let endTime   = this.endTime;
    let xStart    = this.chartAttr.x;
    let xEnd      = this.chartAttr.x + this.chartAttr.w;

    let timeValue = ttCalcX(startTime, endTime, xStart, xEnd, mx);
    console.log(timeValue);

    let clickRange = 1000;
    if (this.dots.length > 1) {
      clickRange = ttRange(this.dots);
    }
    console.log(clickRange);

    let selectedDot;
		for (let i = 0; i < max; i++) {
			let dot = this.dots[i];
			if (dot.time > timeValue - (clickRange / 2) && dot.time < timeValue + (clickRange / 2)
				&& dot.y > my - dot.offset && dot.y < my + dot.offset) {
        selectedDot = dot;
				break;
			}
		}
    this.drawSelected(selectedDot);
    this.notifyMediator("clicked", selectedDot);
  }

  findTooltipData = (pos) => {
    throw new Error("WChart cannot be instantiated. Please extend this class to utilize it");
  }

  initUtils = () => {
    this.heapSort = new HeapSort();
  }

  drawChart = () => {
    this.drawPreBackground();
    this.drawData();
    this.drawPostBackground();
  }

  drawData = () => {
    throw new Error("WChart cannot be instantiated. Please extend this class to utilize it");
  }

  drawSelected = (dot) => {
    this.focused = dot;
    this.drawChart();
  }

  drawPreBackground = () => {
    this._drawBackground();
    this._drawPlot();
  }

  drawPostBackground = () => {
    this._drawAxis();
    // this._drawLabel();
  }
   
  resetData = () =>{
    this.data.clear();
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
    let config = this.config;
    ctx.clearRect(0, 0, width, height);

    ctx.font = "10px Verdana";
    ctx.save();

    let yAxisMax = this.config.yAxis.tick.format(config.yAxis.maxValue);
    this.chartAttr.x = (config.yAxis.tick.display) ? parseInt(ctx.measureText(yAxisMax).width) + 5 : 2;
    this.chartAttr.y = (config.xAxis.tick.display) ? 5 : 5;
    this.chartAttr.w = width - this.chartAttr.x - config.common.offset.right;
    this.chartAttr.h = (config.xAxis.tick.display) ? height - this.chartAttr.y - 20 : height - this.chartAttr.y - 5;
    
    ctx.fillStyle = "rgba(0,0,0,0)";
    ctx.fillRect(0, 0, width, height);

    // ctx.fillStyle = "rgb(50,100,100)";
    // ctx.fillRect(this.chartAttr.x, this.chartAttr.y, this.chartAttr.w, this.chartAttr.h);
  }

  _drawPlot = () => {
    let ctx         = this.ctx;
    let config      = this.config;
    let startTime   = this.startTime;
    let endTime     = this.endTime;
    let chartAttr   = this.chartAttr;
    let xAxisFormat = config.xAxis.tick.format;
    let yAxisFormat = config.yAxis.tick.format;
    let diff        = startTime - endTime;
    const { interval, maxPlot, plotLine: xPlotLine, axisLine: xAxisLine } = config.xAxis;
    const { maxValue, minValue, plotLine: yPlotLine, axisLine: yAxisLine } = config.yAxis;

    const xOptions = {
      format: xAxisFormat || calculateFormat(diff),
      minOffset: 3,
      chartAttr, 
      startTime, 
      endTime, 
      xPlotLine, 
      xAxisLine
    }
    const yOptions = { 
      plots: config.yAxis.plots,
      chartAttr, 
      yPlotLine, 
      yAxisLine,
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
    let ctx         = this.ctx;
    let config      = this.config;
    let startTime   = this.startTime;
    let endTime     = this.endTime;
    let chartAttr   = this.chartAttr;
    let xAxisFormat = config.xAxis.tick.format;
    let yAxisFormat = config.yAxis.tick.format;
    let diff        = startTime - endTime;
    const { interval, maxPlot, plotLine: xPlotLine, axisLine: xAxisLine } = config.xAxis;
    const { maxValue, minValue, plotLine: yPlotLine, axisLine: yAxisLine } = config.yAxis;

    const xOptions = {
      format: xAxisFormat || calculateFormat(diff),
      minOffset: 3,
      chartAttr, startTime, endTime, xPlotLine, xAxisLine
    }
    const yOptions = { 
      format: yAxisFormat,
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

  resizeCanvas = (element) => {
    if (!element) {
      element = this.overrideClientRect();
    }
    this.bcRect = {
      ...this.bcRect,
      width: element.clientWidth,
      height: element.clientHeight,
    }

    this.setDpiSupport();
  }

  resizeCanvasWithSize = (width, height) => {
    this.bcRect = {
      width: width,
      height: height
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

export default WChart;