/**
 * WhaTap LineChart
 * created by MinGu Lee (@immigration9)
 * All rights reserved to WhaTap Labs 2018
 */
import WChart from './WChart';
import moment from 'moment';
import { ttCalcX, ttRange } from './util/positionCalc'
import { drawTooltipCircle } from './helper/drawTooltip';
import { TEN_MIN_IN_MILLIS } from './meta/plotMeta';
import { getMaxValue } from './util/positionCalc';

class LineChart extends WChart{
  constructor(bindId, colorId, options) {
    super(bindId, colorId, options);
  }

  loadData = (dataset) => {
    if (!dataset) return;
    console.log("dataset");
    console.log(dataset);
    let that      = this;
    let config    = this.config;
    this.maxPlot = config.xAxis.maxPlot;
    const { minValue, maxValue, fixedMin, fixedMax }  = config.yAxis;
    
    if (fixedMin) this.minValue = minValue;
    if (fixedMax) this.maxValue = maxValue;

    let maxPlotCnt = 0;

    if (dataset.length > 0) {
      this.data.clear();
      dataset.map((ds, idx) => {
        let colorValue = that.palette.getColorFromId(ds.key);
  
        /**
         * Sorts the inner data in ascending order.
         */
        that.heapSort.sort(ds.data, false, 0);
  
        /**
         * If not fixed Minimum / Maximum value, evaluate the data within and decide the max/min value
         */
        ds.data.map((data) => {
          if (!fixedMax && data[1] > that.maxValue ) {
            that.maxValue = getMaxValue(data[1])
          } 
          if (!fixedMin && data[1] < that.minValue) {
            that.minValue = data[1];
          }
        })
  
        if (ds.data.length > maxPlotCnt) {
          maxPlotCnt = ds.data.length;
        }
  
        that.data.put(ds.key, { id: ds.id, label: ds.label, data: ds.data, color: colorValue });
        /**
         * Only get the initial start time when the option is set to `isFixed=false`
         */
        if (!config.xAxis.isFixed) {
          that.setTimeStandard(ds.data, idx);
        }
  
        if (typeof this.maxPlot === 'undefined') {
          this.maxPlot = maxPlotCnt;
        }
        
      })
    }
    
    this.drawChart();
  }

  findTooltipData = (pos) => {
    const { mx, my } = pos;
    let that      = this;
    let ctx       = this.ctx;
    let startTime = this.startTime;
    let endTime   = this.endTime;
    let xStart    = this.chartAttr.x;
    let xEnd      = this.chartAttr.x + this.chartAttr.w;
    let config    = this.config;

    let timeValue = ttCalcX(startTime, endTime, xStart, xEnd, mx);

    let tooltipRange = 1000;
    if (this.dots.length > 1) {
      tooltipRange = ttRange(this.dots);
    }

    let tooltipList = [];
		for (let i = 0; i < this.dots.length; i++) {
			let dot = this.dots[i];
      if (dot.time > timeValue - (tooltipRange / 2) && dot.time < timeValue + (tooltipRange / 2)) {
        tooltipList.push(dot);
      }
    }
    
    if (this.focused) {
      let currentDot = tooltipList.find((el) => {
        return that.focused.id === el.id
      })
      tooltipList = [currentDot];
    }

		if (tooltipList.length !== 0) {
      let maxTooltipWidth = 0;
      let timestamp = `<div>${config.tooltip.time.format(tooltipList[0].time)}</div>`;

      let list = tooltipList.map((ttl, idx) => {
        let tooltipWidth = 0;
        if (ttl.label) {
          tooltipWidth = parseInt(ctx.measureText(`${ttl.label}: ${ttl.value.toFixed(1)}`).width);
        } else {
          tooltipWidth = parseInt(ctx.measureText(`${ttl.value.toFixed(1)}`).width);
        }
        if (tooltipWidth > maxTooltipWidth) {
          maxTooltipWidth = tooltipWidth;
        }

        return {
          label: ttl.label,
          value: ttl.value,
          colorLabel: drawTooltipCircle(ttl.color),
        }
      })
    
      let listLength = list.length;
      let listColumns = 1;
      if (listLength >= 15) {
        listColumns = Math.ceil(listLength / 15);
      }
      
      let textOutput = "<div><div style='display: block'>";
      textOutput += timestamp;
			list.map((ttl, idx) => {
        if (idx !== 0 && idx % listColumns === 0) {
          textOutput += "</div><div style='display: block'>";
        }
        let out = `<div style='display: inline-block; width: ${maxTooltipWidth + 40}px;'>
                    ${ttl.colorLabel} ${ttl.label ? ttl.label + ': ' : ''}
                    ${config.tooltip.value.format(ttl.value)}
                   </div>`;
				textOutput += out;
      });
      textOutput += "</div></div>";
      
      return textOutput;
		} else {
      return null;
    }
  }


  setTimeStandard = (data, idx) => {
    let config = this.config;
    let { timeDiff } = config.xAxis

    let current = new Date().getTime();
    this.endTime = current;
    this.startTime = current - timeDiff;

    if (idx === 0) {
      this.dataStartTime = data[0][0];
      this.dataEndTime = data[0][0];
    }

    let length = data.length;
    
    for (let i = 0; i < length; i++) {
      if (this.dataStartTime > data[i][0]) {
        this.dataStartTime = data[i][0];
      }
      if (this.dataEndTime < data[i][0]) {
        this.dataEndTime = data[i][0];
      }
    }

    if (this.startTime < this.dataStartTime) {
      this.startTime = this.dataStartTime;
    }
    if (this.endTime > this.dataEndTime) {
      this.endTime = this.dataEndTime;
    }

  }

  updateData = (dataset) => {
    if (!dataset) return;
    let that   = this;
    let config = this.config;
    const { fixedMin, fixedMax }  = config.yAxis;

    dataset.map((ds, idx) => {
      if (that.data.containsKey(ds.key)) {
        let cData = that.data.get(ds.key);
        ds.data.map((datum) => {
          /**
           * `config.common.identicalDataBehavior`
           * 실시간 데이터의 경우, 데이터 생성이 완료되기 전에 API Call로 인해서 data가 수신되었을 수 있다.
           * 이 경우, 이 후에 나머지 데이터가 전송되는 경우, 보간할 것인지 (sum / avg) 혹은 대체할 것인지 (replace)
           * 아니면 중복시킬 것인지(권장되지 않음)를 결정한다.
           */
          let hasData = cData.data.find((d) => {
            return datum[0] === d[0];
          })

          if (typeof hasData !== 'undefined') {
            switch(config.common.identicalDataBehavior) {
              case "avg":
                hasData[1] = (hasData[1] + datum[1]) / 2;
                break;
              case "sum":
                hasData[1] += datum[1];
                break;
              case "replace":
                hasData[1] = datum[1];
              case "none":
              default:
                cData.data.push(datum);
                break;
            }
          } else {
            cData.data.push(datum);
          }
          
          if (!fixedMax && datum[1] > that.maxValue ) {
            that.maxValue = getMaxValue(datum[1]);
          } 
          if (!fixedMin && datum[1] < that.minValue) {
            that.minValue = datum[1];
          }
        })

        that.heapSort.sort(cData.data, false, 0);
      } else {
        let colorValue = that.palette.getColorFromId(ds.key);
        that.data.put(ds.key, { id: ds.id, label: ds.label, data: ds.data1, color: colorValue });
      }
    })

    let en = this.data.keys();
    let idx = 0;
    for (let idx = 0; en.hasMoreElements(); idx++) {
      let key = en.nextElement();
      let value = this.data.get(key);

      if (value.data.length > this.maxPlot) {
        let overflow = value.data.length - this.maxPlot;
        value.data = value.data.slice(overflow);
      }
      that.setTimeStandard(value.data, idx);
    }

    this.drawChart();
  }

  /**
   * @private
   */
  drawData = () => {
    let that      = this;
    let ctx       = this.ctx;
		let startTime = this.startTime;
    let endTime   = this.endTime;
    let config    = this.config;
    // const { timeDiff }            = config.xAxis;
    const { disconnectThreshold } = config.common;
    const { x, y, w, h }          = this.chartAttr;

    ctx.save();

		let _dots = [];
    let en = this.data.keys();
    while(en.hasMoreElements()) {
      let key = en.nextElement();
      let value = this.data.get(key);
      let prevTimestamp = 0;

      let length = value.data.length;
      let lineInit = false;
      for (let i = 0; i < length; i++) {
        let datum = value.data[i];
        if (datum[0] < startTime) continue;
      
        let xPos = (datum[0]- startTime) / (endTime - startTime);
        let xCoord = x + (w * xPos);

        let yPos = 1;
        if ( datum[1] > this.minValue ) {
          if ( datum[1] > this.maxValue ) {
            yPos = 0;
          } else {
            yPos = 1 - (datum[1] - this.minValue) / (this.maxValue - this.minValue);
          }
        } else {
          yPos = 0.99;
        }
        let yCoord = y + (h * yPos);

        /**
         * plot과 plot을 이어주는 line
         */
        ctx.lineWidth = 1.5;
        if (!lineInit) {
          ctx.beginPath();
          
          ctx.strokeStyle = value.color;
					if (this.focused && this.focused.id !== value.id) {
						ctx.strokeStyle = "rgba(245,245,245,0.5)";
					}
          ctx.moveTo(xCoord, yCoord);
          lineInit = true;
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
          key: key,
					id: value.id,
					label: value.label,
					color: value.color,
				  x: xCoord,
          y: yCoord,
          xPos: xPos,
          yPos: yPos,
					r: 5,
          offset: 3,
          time: datum[0],
					value: datum[1]
        })

        prevTimestamp = datum[0];
      }
      // value.data.map((datum, idx) => {
        
      // })
    }
    this.dots = _dots;
    ctx.restore();
  }
}

export default LineChart;
