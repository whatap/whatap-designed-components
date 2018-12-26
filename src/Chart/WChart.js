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
import { ttCalcX, ttRange, calculatePlots } from './util/positionCalc';
import { calculateFormat } from './meta/plotMeta';
import { FONT_SIZE, FONT_TYPE, CHART_TICK_OFFSET_X, CHART_NON_TICK_OFFSET_X, CHART_TICK_SPACE } from './meta/globalMeta';
import { merge } from 'lodash/object';
import { drawHelper } from './helper/drawHelper';
import { colorTheme } from './meta/themeMeta';

/**
 * TODO: 색상 관련 문제 해결 및 Dark Theme 대응 처리
 * TODO: Palette 관련 문제 해결 -> Singleton으로 변경할 필요 있음
 */
class WChart {
  constructor(bindId, colorId, options) {
    this.init(bindId, colorId);
    this.initOptions(options);
    this.setTheme();
    this.initCanvas();

    this.initListener();
    this.initUtils();

    this.focused  = undefined;
    this.mediator = undefined;
  }

  notifyMediator = (action, func, arg) => {
    if (typeof this.mediator !== 'undefined' 
    && typeof this.mediator[action] !== 'undefined') {
      this.mediator[action](func, arg);
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
    this.chartId      = bindId;
    this.canvas       = document.getElementById(bindId);
    this.ctx          = this.canvas.getContext("2d");
    this.data         = new LinkedMap();
    this.palette      = new Palette(colorId);
    this.themePalette = merge({}, colorTheme);

    this.chartAttr = {
      x: 0,
      y: 0,
      w: 0,
      h: 0,
    }
		this.dots = [];
  }

  addTheme = (theme) => {
    this.themePalette = merge(this.themePalette, theme);
  }

  setTheme = (theme) => {
    if (typeof theme === 'undefined' || this.themePalette[theme] === undefined) {
      theme = 'wh';
    }
    this.theme = this.themePalette[theme];
  }

  initOptions = (options) => {
    this.config    = merge({}, defaultOptions, options);
    this.startTime = this.config.xAxis.startTime;
    this.endTime   = this.config.xAxis.endTime;
    this.minValue  = this.config.yAxis.minValue;
    this.maxValue  = this.config.yAxis.maxValue;
  }

  updateOptions = (newOptions) => {
    this.config    = merge({}, this.config, newOptions);
    this.drawChart();
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
    let mousePos       = getMousePos(evt, this.overrideClientRect());
    let ctx            = this.ctx;
    let config         = this.config;
    let { x, y, w, h } = this.chartAttr;
    let { mx, my }     = mousePos;
    let { timeDiff }   = config.xAxis;

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

    this.drawChart();

    if (config.common.drawHelper) {
      drawHelper(ctx, this.chartAttr, mousePos, {
        startTime: this.startTime,
        endTime: this.endTime,
        maxValue: this.maxValue,
        minValue: this.minValue,
        xAxisFormat: config.xAxis.tick.format || calculateFormat(timeDiff),
        yAxisFormat: config.yAxis.tick.format,
      });
    }
  }

  handleMouseOut = (evt) => {
    this.mouseFollow = false;
    this.tooltip.remove();

    this.drawChart();
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
  

    let clickRange = 1000;
    if (this.dots.length > 1) {
      clickRange = ttRange(this.dots);
    }


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
    this.notifyMediator("clicked", "drawSelected", selectedDot);
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
    // this._drawPlot();
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
    let config = this.config;
    ctx.clearRect(0, 0, width, height);

    ctx.font = `${FONT_SIZE}px ${FONT_TYPE}`
    // ctx.save();

    let yAxisMax     = this.config.yAxis.tick.format(this.maxValue);
    this.chartAttr.x = (config.yAxis.tick.display) ? parseInt(ctx.measureText(yAxisMax).width) + CHART_TICK_SPACE + CHART_TICK_OFFSET_X : CHART_NON_TICK_OFFSET_X;
    this.chartAttr.y = (config.xAxis.tick.display) ? 10 : 10;
    this.chartAttr.w = width - this.chartAttr.x - config.common.offset.right;
    this.chartAttr.h = (config.xAxis.tick.display) ? height - this.chartAttr.y - 20 : height - this.chartAttr.y - 5;
    this.plots       = typeof config.yAxis.maxPlots === "number" ? config.yAxis.maxPlots : calculatePlots(this.chartAttr.h);

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
    let plots       = this.plots;
    let xAxisFormat = config.xAxis.tick.format;
    let yAxisFormat = config.yAxis.tick.format;
    let diff        = endTime - startTime;
    const { plotLine: xPlotLine, axisLine: xAxisLine, timeDiff } = config.xAxis;
    const { plotLine: yPlotLine, axisLine: yAxisLine } = config.yAxis;

    const xOptions = {
      format: xAxisFormat || calculateFormat(timeDiff),
      minOffset: 3,
      chartAttr, 
      startTime, 
      endTime, 
      xPlotLine, 
      xAxisLine
    }
    const yOptions = { 
      plots,
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
    let minValue    = this.minValue;
    let maxValue    = this.maxValue;
    let plots       = this.plots;
    let theme       = this.theme;
    let xAxisFormat = config.xAxis.tick.format;
    let yAxisFormat = config.yAxis.tick.format;
    let diff        = endTime - startTime;
    const { plotLine: xPlotLine, axisLine: xAxisLine, timeDiff } = config.xAxis;
    const { plotLine: yPlotLine, axisLine: yAxisLine } = config.yAxis;

    const xOptions = {
      format: xAxisFormat || calculateFormat(timeDiff),
      minOffset: 3,
      chartAttr, startTime, endTime, xPlotLine, xAxisLine, theme
    }
    const yOptions = { 
      format: yAxisFormat,
      minValue, maxValue,
      chartAttr, yPlotLine, yAxisLine, plots, theme
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