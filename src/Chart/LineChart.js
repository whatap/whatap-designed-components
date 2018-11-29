/**
 * WhaTap LineChart
 * created by MinGu Lee (@immigration9)
 * All rights reserved to WhaTap Labs 2018
 */
import moment from 'moment';
import WChart from './WChart';
import { getMousePos  } from './helper/mouseEvt';

import { createStyle, styleHidden, drawTooltipCircle } from './helper/drawTooltip';
import ChartMediator from './mediator/ChartMediator';

class LineChart extends WChart{
  constructor(bindId, colorId, options) {
    super(bindId, colorId, options);

    this.initListener();

    this.focused  = undefined;
    this.mediator = ChartMediator;
  }

  notifyMediator = (action, arg) => {
    if (typeof this.mediator[action] !== 'undefined') {
      this.mediator[action](arg);
    }
  }

  initListener = () => {
    this.canvas.addEventListener('mousemove', this.handleMouseMove);
    this.canvas.addEventListener('click', this.handleMouseClick);
    this.canvas.addEventListener('mouseout', this.handleMouseOut);
  }

	handleMouseMove = (evt) => {
		let that       = this;
		let ctx        = this.ctx;
    let mousePos   = getMousePos(this.overrideClientRect(), evt);
    let { mx, my } = mousePos;
    let posX       = evt.clientX;
    let posY       = evt.clientY;

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
			let list = tooltipList.map((ttl, idx) => {
        let colorLabel = drawTooltipCircle(ttl.color);
        let tooltip = `<span>${colorLabel} ${ttl.oname}: ${ttl.value.toFixed(1)}<br/></span>`;
        if (idx === 0) {
          let timestamp = `<span>${moment.unix(ttl.time / 1000)}</span><br/>`
          return timestamp + tooltip;
        }
				return tooltip;
      });
			this.tooltip.style.cssText = createStyle(mx, my);
			this.tooltip.innerHTML = "";
			list.map((ttl, idx) => {
				that.tooltip.innerHTML += ttl;
			});
			this.tooltipOn = true;
		} else {
			this.tooltip.style.cssText = styleHidden();
    }
    
    // notifyMediator("moved", data);
	}

	handleMouseClick = (evt) => {
    let mousePos = getMousePos(this.overrideClientRect(), evt);
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

  handleMouseOut = (evt) => {
    this.tooltip.style.cssText = styleHidden();
  }

  drawSelected = (dot) => {
    this.focused = dot;
    this.drawChart();
  }

  loadData = (dataset) => {
    if (!dataset) return;
    let that   = this;
    let config = this.config;

    dataset.map((ds, idx) => {
      let colorValue = that.palette.getColorFromOid(ds.oid);

      /**
       * Sorts the inner data in ascending order.
       */
      that.heapSort.sort(ds.data, false, 0);

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
    console.log(dataset);
    if (!dataset) return;
    let that = this;
    const { maxPlot } = this.config.xAxis;

    dataset.map((ds, idx) => {
      if (that.data.containsKey(ds.oid)) {
        let cData = that.data.get(ds.oid);
        ds.data.map((datum) => {
          cData.data.push(datum);
        })
        that.heapSort.sort(cData.data, false, 0);
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
    this.drawPreBackground();
    this._drawData();
    this.drawPostBackground();
  }

  /**
   * @private
   */
  _drawData = () => {
    let that      = this;
    let ctx       = this.ctx;
		let startTime = this.startTime;
    let endTime   = this.endTime;

    const { minValue, maxValue }  = this.config.yAxis;
    const { disconnectThreshold } = this.config.common;
    const { x, y, w, h }          = this.chartAttr;
    
		let _dots = [];
    let en = this.data.keys();
    while(en.hasMoreElements()) {
      let key = en.nextElement();
      let value = this.data.get(key);
      let prevTimestamp = 0;

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
          if (datum[0] - prevTimestamp < disconnectThreshold) {
            ctx.lineTo(xCoord, yCoord);
            ctx.stroke();
          } else {
            ctx.closePath();
          }
          
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

        prevTimestamp = datum[0];
      })
    }
	  this.dots = _dots;
  }
}

export default LineChart;
