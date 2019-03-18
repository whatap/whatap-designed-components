import AbstractChart from './AbstractChart'
import { drawXplot, drawYplot, drawXaxis, drawYaxis } from './helper/drawBorder';
import { drawXtick, drawYtick } from './helper/drawTick';
import Tooltip from './helper/drawTooltip';
import { getMousePos } from './helper/mouseEvt'
import { tooltipCalcX, tooltipRange, calculatePlots } from './util/positionCalc';
import { calculateFormat } from './meta/plotMeta';
import { FONT_SIZE, FONT_TYPE, CHART_TICK_OFFSET_X, CHART_NON_TICK_OFFSET_X, CHART_TICK_SPACE } from './meta/globalMeta';
import merge from 'lodash.merge';
import { drawHelper } from './helper/drawHelper';
import { getScreenRatio } from './util/displayModulator';
import ChartObserver from './observer/ChartObserver';

/**
 * TODO: 색상 관련 문제 해결 및 Dark Theme 대응 처리
 * TODO: Palette 관련 문제 해결 -> Singleton으로 변경할 필요 있음
 */
class WChart extends AbstractChart {
  constructor(bindId, options) {
    super(bindId, options);
    this.setTheme();
    this.initCanvas();

    this.initListener();

    this.focused  = [];
    // this.mediator = undefined;
    this.isSubscribed = true;
    this.chartMouseClick = undefined;
    this.chartObserver = ChartObserver.instance;

    this.subscribeObserver();
  }

  // notifyMediator = (action, func, arg) => {
  //   if (typeof this.mediator !== 'undefined' 
  //   && typeof this.mediator[action] !== 'undefined') {
  //     try {
  //       this.mediator[action](func, arg);
  //     } catch (e) {
  //       console.log("mediator not defined");
  //     }
  //   }
  // }

  notifyObserver = (eventName, data) => {
    this.chartObserver.notify(eventName, data);
  }

  addTheme = (theme) => {
    this.themePalette = merge(this.themePalette, theme);
  }

  setTheme = (theme, override=false) => {
    if (typeof theme === 'undefined' || this.themePalette[theme] === undefined) {
      theme = 'wh';
    }
    this.theme = this.themePalette[theme];
    this.themeId = theme;

    if (override) {
      this.drawChart();
    }
  }


  initCanvas = () => {
    this.wGetBoundingClientRect(this.canvas);
    this.ratio = getScreenRatio(this.ratio);

    let width  = this.bcRect.width;
    let height = this.bcRect.height;

    this.canvas.width        = width * this.ratio;
    this.canvas.height       = height * this.ratio;
    this.canvas.style.width  = (width) + "px";
    this.canvas.style.height = (height) + "px";

    this.ctx.scale(this.ratio, this.ratio);

    this.drawPreBackground();
  }

  initListener = () => {
    this.tooltip = new Tooltip();
    this.canvas.addEventListener("mouseover", (evt) => this.handleMouseOver(evt, ));
    this.canvas.addEventListener("mousemove", this.handleMouseMove);
    this.canvas.addEventListener("mouseout", this.handleMouseOut);
    this.canvas.addEventListener("click", this.handleMouseClick);
  }

  subscribeObserver = () => {
    this.chartObserver.subscribe("clicked", this.drawSelectedGlobal, this);
  }

  handleMouseOver = (evt) => {
    let canvas   = this.canvas;
    let ctx      = this.ctx;
    let mousePos = getMousePos(evt, this.overrideClientRect());
    
    let textOutput = this.findTooltipData(mousePos);
    let plotOutput = this.findPlotPoint(mousePos);

    if (textOutput !== null) {
      canvas.style.cursor = "pointer";
      this.mouseFollow = true;
      this.tooltip.append(evt, textOutput);
    }

    if (plotOutput) {
      this.plotPoint = true;
    }
  }

  handleMouseMove = (evt) => {
    let mousePos       = getMousePos(evt, this.overrideClientRect());
    let canvas         = this.canvas;
    let ctx            = this.ctx;
    let config         = this.config;
    let { x, y, w, h } = this.chartAttr;
    let { mx, my }     = mousePos;
    let { timeDiff }   = config.xAxis;

    let textOutput = this.findTooltipData(mousePos);
    let plotOutput = this.findPlotPoint(mousePos);

    if (textOutput !== null) {
      canvas.style.cursor = "pointer";
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

    if (plotOutput) {
      this.plotPoint = true;
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
    let canvas = this.canvas;
    canvas.style.cursor = "default";
    this.mouseFollow = false;
    this.tooltip.remove();

    this.hoveredPlots = false;

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
    let mediator  = this.mediator;

    let timeValue = tooltipCalcX(startTime, endTime, xStart, xEnd, mx);
  

    let clickRange = 1000;
    if (this.dots.length > 1) {
      clickRange = tooltipRange(this.dots);
    }


    let selectedDot;
    let dots = [];
		for (let i = 0; i < max; i++) {
			let dot = this.dots[i];
			if (dot.time > timeValue - (clickRange / 2) && dot.time < timeValue + (clickRange / 2)
				&& dot.y > my - dot.offset && dot.y < my + dot.offset) {
        selectedDot = dot;
				break;
			}
    }

    if (selectedDot) {
      for (let i = 0; i < max; i++) {
        let dot = this.dots[i];
        if (dot.time > timeValue - (clickRange / 2) && dot.time < timeValue + (clickRange / 2)
          && selectedDot.id === dot.id) {
          dots.push(dot);
        }
      }
    }
    
    this.drawSelected(dots);
    
    if (this.isSubscribed) {
      this.notifyObserver("clicked", dots);
    }

    if (this.chartMouseClick) {
      this.chartMouseClick(dots);
    }
  }

  findTooltipData = (pos) => {
    throw new Error("WChart cannot be instantiated. Please extend this class to utilize it");
  }

  findPlotPoint = (pos) => {
    throw new Error("WChart cannot be instantiated. Please extend this class to utilize it");
  }

  drawChart = () => {
    let validated = this.dataValidation();

    this.drawPreBackground();
    if (validated) {
      this.drawData();
      this.drawPostBackground();
    }
  }

  drawData = () => {
    throw new Error("WChart cannot be instantiated. Please extend this class to utilize it");
  }

  drawSelected = (dots) => {
    this.focused = dots;
    this.drawChart();
  }

  drawSelectedGlobal = (dots) => {
    if (this.isSubscribed) {
      this.focused = dots;
      this.drawChart();
    }
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

    const calcWidth = width - this.chartAttr.x - config.common.offset.right;
    const calcHeight = (config.xAxis.tick.display) ? height - this.chartAttr.y - 20 - config.common.offset.bottom : height - this.chartAttr.y - 5 - config.common.offset.bottom;

    let yAxisMax     = this.config.yAxis.tick.format(this.maxValue);
    this.chartAttr.x = (config.yAxis.tick.display) ? parseInt(ctx.measureText(yAxisMax).width) + CHART_TICK_SPACE + CHART_TICK_OFFSET_X + config.common.offset.left : CHART_NON_TICK_OFFSET_X + config.common.offset.left;
    this.chartAttr.y = (config.xAxis.tick.display) ? 10 + config.common.offset.top : 10 + config.common.offset.top;
    this.chartAttr.w = calcWidth > 0 ? calcWidth : 0;
    this.chartAttr.h = calcHeight > 0 ? calcHeight : 0;
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
      format: xAxisFormat || calculateFormat(diff),
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
      format: xAxisFormat || calculateFormat(diff),
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

}

export default WChart;