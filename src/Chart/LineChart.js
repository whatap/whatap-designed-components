/**
 * WhaTap LineChart
 * created by MinGu Lee (@immigration9)
 * All rights reserved to WhaTap Labs 2018
 */
import { LinkedMap, HeapSort } from '../core';
import { Palette } from '../Palette';
import moment from 'moment';
import WChart from './WChart';
import { getMousePos  } from './helper/mouseEvt';
import { mergeDeep } from './helper/mergeDeep';
import { drawXtick, drawYtick } from './helper/drawTick';
import { drawXplot, drawYplot, drawXaxis, drawYaxis } from './helper/drawBorder';
import ChartMediator from './mediator/ChartMediator';

const UNIX_TIMESTAMP = 1000;
const MINUTE_IN_SECONDS = 60;

const defaultOptions = {
  xAxis: {
    maxPlot: 60,
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
    maxValue: 100,
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

function createStyle(mx, my) {
  const innerStyle = {
    'position': 'absolute',
    'float': 'left',
    'left': `${mx + 15}px`,
    'top': `${my}px`,
    'z-index': 10000,
    'visibility': 'visible',
    'background-color': '#000000',
    'border-radius': '6px',
    'padding': '3px',
    'color': '#ffffff',
    'font-size': '8px',
  }

  let output = '';
  for (let key in innerStyle) {
    if (innerStyle.hasOwnProperty(key)) {
      output += `${key}:${innerStyle[key]};`
    }
  }
  return output;
}

const heapSort = new HeapSort();

class LineChart extends WChart{
  constructor(bindId, colorId, options) {
    super();
    this.init(bindId);
    this.initOptions(options);
    this.initCanvas();

    this.palette = new Palette(colorId);
    this.focused = undefined;
    this.mediator = ChartMediator;
  }

  notifyMediator = (action, arg) => {
    if (typeof this.mediator[action] !== 'undefined') {
      this.mediator[action](arg);
    }
  }

	handleMouseMove = (evt) => {
		let that = this;
		let ctx = this.ctx;
    let mousePos = getMousePos(this.wGetBoundingClientRect(), evt);
    let { mx, my } = mousePos;
    let posX = evt.clientX;
    let posY = evt.clientY;
		if (this.tooltipOn) {
			this.drawChart();
		}
		this.tooltipOn = false;
		let tooltipList = [];
		for (let i = 0; i < this.dots.length; i++) {
			let dot = this.dots[i];
			if (dot.x > mx - dot.offset && dot.x < mx + dot.offset) {
				tooltipList.push(dot);
			}
		}
		if (tooltipList.length !== 0) {
			// ctx.textAlign = "left";
			// ctx.font = "12px Verdana";
			// ctx.fillStyle = "black";
			// tooltipList.map((ttl, idx) => {
			// 	let output = `${ttl.oname}: ${ttl.value.toFixed(1)}`;
			// 	ctx.fillText(output, mx + 5, my + (idx * 10));
			// });
			let list = tooltipList.map((ttl, idx) => {
        let colorLabel = drawTooltipCircle(ttl.color, style);
        let tooltip = `<span>${colorLabel} ${ttl.oname}: ${ttl.value.toFixed(1)}<br/></span>`;
        if (idx === 0) {
          let timestamp = `<span>${moment.unix(ttl.time / 1000)}</span><br/>`
          return timestamp + tooltip;
        }
				return tooltip;
      });
			this.tooltip.style.cssText = createStyle(posX, posY);
			this.tooltip.innerHTML = "";
			list.map((ttl, idx) => {
				that.tooltip.innerHTML += ttl;
			});
			this.tooltipOn = true;
		} else {
			this.tooltip.style.cssText = "visibility:hidden";
    }
    
    // notifyMediator("moved", data);
	}

	handleMouseClick = (evt) => {
    let mousePos = getMousePos(this.wGetBoundingClientRect(), evt);
		let { mx, my } = mousePos;
    let max = this.dots.length;

    let selectedDot;
		for (let i = 0; i < max; i++) {
			let dot = this.dots[i];
			if (dot.x > mx - dot.offset && dot.x < mx + dot.offset
				&& dot.y > my - dot.offset && dot.y < my + dot.offset) {
        selectedDot = dot;
				break;
			}
		}
    this.drawSelected(selectedDot);
    this.notifyMediator("clicked", selectedDot);
  }

  drawSelected = (dot) => {
    this.focused = dot;
    this.drawChart();
  }
  
  handleMouseOut = (evt) => {
    this.tooltip.style.cssText = "visibility:hidden";
  }

  init = (bindId) => {
    this.chartId = bindId;
    this.canvas = document.getElementById(bindId);
    this.ctx = this.canvas.getContext("2d");
    this.data = new LinkedMap();

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
    this.config = mergeDeep(defaultOptions, options);
    console.log(this.config);

    this.startTime = this.config.xAxis.startTime;
    this.endTime = this.config.xAxis.endTime;
  }

  initCanvas = () => {
    this.wGetBoundingClientRect(this.canvas);
    this.wGetScreenRatio();
		this.canvas.addEventListener('mousemove', this.handleMouseMove);
    this.canvas.addEventListener('click', this.handleMouseClick);
    this.canvas.addEventListener('mouseout', this.handleMouseOut);

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
    let config = this.config;

    dataset.map((ds, idx) => {
      let colorValue = that.palette.getColorFromOid(ds.oid);

      /**
       * Sorts the inner data in ascending order.
       */
      heapSort.sort(ds.data, false, 0);

      that.data.put(ds.oid, { oname: ds.oname, data: ds.data, color: colorValue });
      /**
       * Only get the initial start time when the option is set to `isFixed=false`
       */
      if (!config.xAxis.isFixed) {
        that.setTimeStandard(ds.data, idx);
      }
      
    })

    this.drawChart();
  }

  setTimeStandard = (data, idx) => {
    console.log(data);
    if (idx === 0) {
      this.startTime = data[0][0];
      this.endTime = data[0][0];
    }

    let length = data.length;
    for (let i = 0; i < length; i++) {
      if (this.startTime > data[i][0]) {
        this.startTime = data[i][0];
      }
      if (this.endTime < data[i][0]) {
        this.endTime = data[i][0];
      }
    }
  }

  updateData = (dataset) => {
    if (!dataset) return;
    let that = this;
    const { maxPlot } = this.config.xAxis;

    dataset.map((ds, idx) => {
      if (that.data.containsKey(ds.oid)) {
        let cData = that.data.get(ds.oid);
        ds.data.map((datum) => {
          cData.data.push(datum);
        })
        heapSort.sort(cData.data, false, 0);
      } else {
        let colorValue = that.palette.getColorFromOid(ds.oid);
        that.data.put(ds.oid, { oname: ds.oname, data: ds.data, color: colorValue });
      }
    })

    let en = this.data.keys();
    let idx = 0;
    for (let idx = 0; en.hasMoreElements(); idx++) {
      let key = en.nextElement();
      let value = this.data.get(key);

      if (value.data.length > maxPlot) {
        let overflow = value.data.length - maxPlot;
        console.log(overflow);
        value.data = value.data.slice(overflow);
        that.setTimeStandard(value.data, idx);
      }
    }

    this.drawChart();
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
    let width = this.bcRect.width;
    let height = this.bcRect.height;
    let plots = this.plots;
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

  /**
   * @private
   */
  _drawAxis = () => {
    let that = this;
    let ctx = this.ctx;
    let width = this.bcRect.width;
    let height = this.bcRect.height;
    let config = this.config;
    let startTime = this.startTime;
    let endTime = this.endTime;
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
  _drawData = () => {
    let that = this;
    let ctx = this.ctx;
		let startTime = this.startTime;
    let endTime = this.endTime;
    const { x, y, w, h } = this.chartAttr;
    const { minValue, maxValue } = this.config.yAxis;
    
		let _dots = [];
    let en = this.data.keys();
    while(en.hasMoreElements()) {
      let key = en.nextElement();
      let value = this.data.get(key);

      value.data.map((datum, idx) => {
        if (datum[0] < startTime || datum[0] > endTime ) return;
        /**
         * TODO: STARTTIME에 문제가 있음.
         */
        let xPos = (datum[0] - startTime) / (endTime - startTime);
        let xCoord = x + (w * xPos);

        let yPos = 1;
        if ( datum[1] > minValue ) {
          if ( datum[1] > maxValue ) {
            yPos = 0;
          } else {
            yPos = 1 - (datum[1] - minValue) / (maxValue - minValue);
          }
        }
        let yCoord = y + (h * yPos);

        /**
         * plot과 plot을 이어주는 line
         */
        if (idx === 0) {
          ctx.beginPath();
          ctx.strokeStyle = value.color;
					if (this.focused && this.focused.oid !== key) {
						ctx.strokeStyle = "rgba(245,245,245,0.5)";
					}
          ctx.moveTo(xCoord, yCoord);
        } else {
          ctx.lineTo(xCoord, yCoord);
          ctx.stroke();

          ctx.beginPath();
          ctx.moveTo(xCoord, yCoord);
        }

				_dots.push({
					oid: key,
					oname: value.oname,
					color: value.color,
				  x: xCoord,
					y: yCoord,
					r: 5,
          offset: 2,
          time: datum[0],
					value: datum[1]
				})
      })
    }
	  this.dots = _dots;
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

  
}

const style = 'border: none; display: block; float: left; width: 6px; height: 6x; margin-right: 5px; margin-top: 0px;';

function drawTooltipCircle(color, style) {
  var circle = '<span style="' + style + '"><svg height="8" width="8">'
  circle += '<circle cx="4" cy="4" r="4" fill="' + color + '" />'
  circle += '</svg></span>'
  return circle
}


export default LineChart;
