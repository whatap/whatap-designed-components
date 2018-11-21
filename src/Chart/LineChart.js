/**
 * WhaTap LineChart
 * created by MinGu Lee (@immigration9)
 * All rights reserved to WhaTap Labs 2018
 */
import { LinkedMap } from '../core';
import { Palette } from '../Palette';
import moment from 'moment';
import WChart from './WChart';
import { getMousePos  } from './helper/MouseEvent';

const UNIX_TIMESTAMP = 1000;
const MINUTE_IN_SECONDS = 60;

const defaultOptions = {
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


class LineChart extends WChart{
  constructor(bindId, colorId, options) {
    super();
    this.init(bindId);
    this.initOptions(options);
    this.initCanvas();

    this.palette = new Palette(colorId);
		this.focused = undefined;
  }

	handleMouseMove = (evt) => {
		let that = this;
		let ctx = this.ctx;
		let mousePos = getMousePos(this.wGetBoundingClientRect(), evt);
		let { mx, my } = mousePos;
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
				return `<span>${colorLabel} ${ttl.oname}: ${ttl.value.toFixed(1)}<br/></span>`;
			});
			this.tooltip.style.cssText = `position:absolute;float:left;left:${mx + 15}px;top:${my}px;z-index:10000;visibility:visible`;
			this.tooltip.innerHTML = "";
			list.map((ttl, idx) => {
				that.tooltip.innerHTML += ttl;
			});
			this.tooltipOn = true;
		} else {
			this.tooltip.style.cssText = "visibility:hidden";
		}
	}

	handleMouseClick = (evt) => {
		let ctx = this.ctx;
		let mousePos = getMousePos(this.wGetBoundingClientRect(), evt);
		let { mx, my } = mousePos;
	
		let dotSelected = false;
		for (let i = 0; i < this.dots.length; i++) {
			let dot = this.dots[i];
			if (dot.x > mx - dot.offset && dot.x < mx + dot.offset
				&& dot.y > my - dot.offset && dot.y < my + dot.offset) {
				this.focused = dot;
				dotSelected = true;
				this.drawChart();
				break;
			}
		}

		if (dotSelected === false) {
			this.focused = undefined;
			this.drawChart();
		}
	}

  init = (bindId) => {
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
    this.config = { ...defaultOptions, ...options };

    this.startTime = this.config.xAxis.startTime;
    this.endTime = this.config.xAxis.endTime;
  }

  initCanvas = () => {
    this.wGetBoundingClientRect(this.canvas);
    this.wGetScreenRatio();
		this.canvas.addEventListener('mousemove', this.handleMouseMove);
		this.canvas.addEventListener('click', this.handleMouseClick);

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
    console.log(dataset);

    dataset.map((ds, idx) => {
      let colorValue = that.palette.getColorFromOid(ds.oid);
      that.data.put(ds.oid, { oname: ds.oname, data: ds.data, color: colorValue });
      /**
       * Only get the initial start time when the option is set to `isFixed=true`
       */
      if (config.xAxis.isFixed) {
        if (idx === 0) {
          that.startTime = ds.data[0][0];
        } else {
          if (that.startTime > ds.data[idx][0]) {
            that.startTime = ds.data[idx][0];
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
        let cData = that.data.get(ds.oid);
        ds.data.map((datum) => {
          cData.data.push(datum);
        })
        if (cData.data.length > maxPlot) {
          let overflow = cData.data.length - maxPlot;
          cData.data = cData.data.slice(overflow);
        }
      } else {
        let colorValue = that.palette.getColorFromOid(ds.oid);
        that.data.put(ds.oid, { oname: ds.oname, data: ds.data, color: colorValue });
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
    const { x, y, w, h } = this.chartAttr;
    const { interval, maxPlot } = config.xAxis;

    /**
     * Plot gridline
     */
    if (config.xAxis.plotLine.display) {
      let drawPlots = maxPlot / interval;
      let widthInterval = w / drawPlots;
      for (let i = 1; i < drawPlots; i++) {
        ctx.beginPath();
        ctx.setLineDash([1, 2]);
        ctx.strokeStyle = config.xAxis.plotLine.color;
        ctx.moveTo(x + (i * widthInterval), y);
        ctx.lineTo(x + (i * widthInterval), y + h);
        ctx.stroke();
      }
    }

    if (config.yAxis.plotLine.display) {
      let heightInterval = h / config.yAxis.plots;
      for (let i = 0; i < config.yAxis.plots; i++) {
        ctx.beginPath();
        ctx.setLineDash([1, 2]);
        ctx.strokeStyle = config.yAxis.plotLine.color;
        ctx.moveTo(x, y + (i * heightInterval));
        ctx.lineTo(x + w, y + (i * heightInterval));
        ctx.stroke();
      }
    }

    /**
     * Tick labels
     * TODO: Change demo to actual data;
     */
    if (config.xAxis.tick.display) {
      let drawPlots = maxPlot / interval;
      let widthInterval = w / drawPlots;
      for (let i = 1; i < drawPlots; i++) {
        ctx.restore();
				ctx.textAlign = "left";
        let time_value = moment.unix((startTime + (i * interval * 1000)) / 1000).format("HH:mm");
        ctx.fillText(time_value, x + (i * widthInterval) - 12, y + h + 9);
      }

    }

    if (config.yAxis.tick.display) {
      let heightInterval = h / config.yAxis.plots;
      let { maxValue } = config.yAxis;
      let tickValue = maxValue;
      for (let i = 0; i < config.yAxis.plots + 1; i++) {
        ctx.textAlign = "right";
        ctx.fillText(tickValue, x - 2, (y + 3) + (i * heightInterval));
        tickValue -= (maxValue / (config.yAxis.plots));
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
        if (datum[0] < this.startTime || datum[0] > this.endTime ) return;
        let xPos = (datum[0] - this.startTime) / (this.endTime - this.startTime);
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

        // ctx.fillStyle = "#333333";
        // ctx.fillRect(xCoord, yCoord, 0.5, 0.5);

        /**
         * plot과 plot을 이어주는 line
         */
        if (idx === 0) {
          ctx.beginPath();
          ctx.strokeStyle = value.color;
					if (this.focused && this.focused.oid !== key) {
						ctx.strokeStyle = "rgba(245,245,245,0.5)";
					}
					// if (this.focused && this.focused.oid === key) {
					// 	ctx.save();
					// 	ctx.textAlign = "left";
					// 	ctx.fillText(`Currently Selected: ${value.oname}`, 100, 50);
					// 	ctx.fillText(`Value: ${datum[1]}`, 100, 70);
					// 	ctx.restore();
					// }
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

const style = 'border: none; display: block; float: left; width: 12px; height: 12px; margin-right: 4px; margin-top: 3px;';

function drawTooltipCircle(color, style) {
  var circle = '<span style="' + style + '"><svg height="12" width="12">'
  circle += '<circle cx="6" cy="6" r="6" fill="' + color + '" />'
  circle += '</svg></span>'
  return circle
}


export default LineChart;
