import merge from 'lodash.merge'
import { dataValidation } from './util/dataValidator'
import { setDpiSupport } from './util/displayModulator'
import { LinkedMap, HeapSort } from '../core'
import ColorSelector from './helper/ColorSelector'
import { colorTheme } from './meta/themeMeta'
import defaultOptions from './option/lineChartDefault'

class AbstractChart {
  constructor(bindId, options) {
    this.init(bindId);
    this.initOptions(options);

    this.initUtils();
  }

  /**
   * Init variables, options, utils
   */
  init = (bindId) => {
    this.chartId      = bindId;
    this.canvas       = document.getElementById(bindId);
    this.ctx          = this.canvas.getContext("2d");
    this.data         = new LinkedMap();
    this.palette      = ColorSelector.instance;
    this.plotPoint    = true;
    this.hoveredPlots = [];

    this.themePalette = merge({}, colorTheme);

    this.chartAttr = {
      x: 0,
      y: 0,
      w: 0,
      h: 0,
    }
		this.dots = [];
  }

  initOptions = (options) => {
    this.config    = merge({}, defaultOptions, options);
    this.startTime = this.config.xAxis.startTime;
    this.endTime   = this.config.xAxis.endTime;
    this.minValue  = this.config.yAxis.minValue;
    this.maxValue  = this.config.yAxis.maxValue;
  }

  initUtils = () => {
    this.heapSort = new HeapSort();
    this.dataValidation = dataValidation;
  }

  updateOptions = (newOptions) => {
    this.config    = merge({}, this.config, newOptions);
    this.drawChart();
  }

  /**
   * Client Size & Ratio reset
   */
  // clearClientRect = () => {
  //   this.bcRect = null;
  // }

  // clearScreenRatio = () => {
  //   this.ratio = null;
  // }

  /**
   * Get screen size & ratio
   */
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

  resizeCanvas = (element, fixedHeight) => {
    if (!element) {
      element = this.overrideClientRect();
    }

    if (!fixedHeight) {
      this.bcRect = {
        ...this.bcRect,
        width: element.clientWidth,
        height: element.clientHeight,
      }
    } else {
      this.bcRect = {
        ...this.bcRect,
        width: element.clientWidth,
        height: Number(fixedHeight),
      }
    }

    setDpiSupport(this.canvas, this.ctx, this.ratio, this.bcRect);
  }

  resizeCanvasWithSize = (width, height) => {
    this.bcRect = {
      width: width,
      height: height
    }

    setDpiSupport(this.canvas, this.ctx, this.ratio, this.bcRect);
  }

}

export default AbstractChart;