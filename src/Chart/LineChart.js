/**
 * WhaTap LineChart
 * created by MinGu Lee (@immigration9)
 * All rights reserved to WhaTap Labs 2018
 */
import WChart from './WChart';
import moment from 'moment';
import { tooltipCalcX, tooltipRange } from './util/positionCalc'
import { drawTooltipCircle } from './helper/drawTooltip';
import { TEN_MIN_IN_MILLIS, SEC_IN_MILLIS } from './meta/plotMeta';
import { getMaxValue } from './util/positionCalc';
import { CoreFunc } from '../core';

class LineChart extends WChart{
  constructor(bindId, colorId, options) {
    super(bindId, colorId, options);
  }

  loadData = (dataset) => {
    if (!dataset && dataset.length === 0) return;

    let that      = this;
    let config    = this.config;
    let plots     = this.plots;
    this.maxPlot  = config.xAxis.maxPlot;
    const { minValue, maxValue, fixedMin, fixedMax }  = config.yAxis;
    
    this.minValue = minValue;
    this.maxValue = maxValue;

    let maxPlotCnt = 0;
    
    if (dataset.length > 0) {
      let timeLimits = [];

      this.data.clear();
      dataset.map((ds, idx) => {
        let colorValue = that.palette.getColorFromId(ds.id);
        let strokeValue = CoreFunc.formatRgb(colorValue.rgb, colorValue.alpha);
        let fillValue = CoreFunc.formatRgb(colorValue.rgb, 0.2);
  
        /**
         * Sorts the inner data in ascending order.
         */
        that.heapSort.sort(ds.data, false, 0);

        /**
         * Cropping method for when data received is 0.
         */
        if (ds.data.length > 5) {
          let dsLength = ds.data.length;
          for (let i = dsLength - 1; i > dsLength - 5; i--) {
            if (ds.data[i]) {
              if (ds.data[i][1] === 0) {
                ds.data.splice(i, 1);
              }
            }
          }
        }
  
        /**
         * If not fixed Minimum / Maximum value, evaluate the data within and decide the max/min value
         */
        ds.data.map((data) => {
          if (!fixedMax && typeof data[1] === 'number' && data[1] > that.maxValue ) {
            that.maxValue = getMaxValue(data[1], plots)
          } 
          if (!fixedMin && typeof data[1] === 'number' && data[1] < that.minValue) {
            that.minValue = data[1];
          }
        })
  
        if (ds.data.length > maxPlotCnt) {
          maxPlotCnt = ds.data.length;
        }
  
        that.data.put(ds.key, { id: ds.id, label: ds.label, data: ds.data, color: strokeValue, fill: fillValue });
        /**
         * Only get the initial start time when the option is set to `isFixed=false`
         */
        if (!config.xAxis.isFixed && ds.data.length > 0) {
          let timeStartEnd = that.getStartEndTime(ds.data, true);
          timeLimits.push(timeStartEnd);
        }
  
        if (typeof that.maxPlot === 'undefined') {
          that.maxPlot = maxPlotCnt;
        }
        
      })

      if (!config.xAxis.isFixed && timeLimits.length > 0) {
        this.setTimeStandard(timeLimits);
      }
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

    let timeValue = tooltipCalcX(startTime, endTime, xStart, xEnd, mx);

    let ttRange = 1000;
    if (this.dots.length > 1) {
      ttRange = tooltipRange(this.dots);
    }

    let tooltipList = [];
		for (let i = 0; i < this.dots.length; i++) {
			let dot = this.dots[i];
      if (dot.time > timeValue - (ttRange / 2) && dot.time < timeValue + (ttRange / 2)) {
        tooltipList.push(dot);
      }
    }
    
    if (this.focused && this.focused.length > 0) {
      let currentDot = tooltipList.filter((el) => {
        let dot = that.focused.find((fc) => fc.id === el.id)
        if (dot) return dot;
      })
      tooltipList = currentDot;
    }

		if (tooltipList.length !== 0) {
      let timestamp = config.tooltip.time.format(tooltipList[0].time);
      let maxTooltipWidth = parseInt(ctx.measureText(timestamp).width) || 0;
      let maxLabelWidth = 0;
      let maxValueWidth = 0;

      let list = tooltipList.map((ttl, idx) => {
        let tooltipWidth = 0;
        let labelWidth = 0;
        let valueWidth = 0;
        if (ttl.label) {
          // tooltipWidth = parseInt(ctx.measureText(`${ttl.label}: ${ttl.value.toFixed(1)}`).width);
          labelWidth = parseInt(ctx.measureText(`${ttl.label}`).width);
        } 
        // else {
          // tooltipWidth = parseInt(ctx.measureText(`${ttl.value.toFixed(1)}`).width);
        // }
        valueWidth = parseInt(ctx.measureText(`${ttl.value.toFixed(1)}`).width);
        tooltipWidth = labelWidth + valueWidth;
        if (labelWidth > maxLabelWidth)     maxLabelWidth   = labelWidth;
        if (valueWidth > maxValueWidth)     maxValueWidth   = valueWidth;
        if (tooltipWidth > maxTooltipWidth) maxTooltipWidth = tooltipWidth;

        return {
          label: ttl.label,
          value: ttl.value,
          colorLabel: drawTooltipCircle(ttl.color),
        }
      })
    
      let timeEl = `<div style='display: block; text-align: center; padding-left: 1px; padding-right: 1px;'>${timestamp}</div>`;
      
      let textOutput = "<div>";
      textOutput += timeEl;

      let length = list.length;
      const ROW_COUNT = 15;
      let columns = Math.ceil(length / ROW_COUNT);
      let widthRatio = 100 / columns;
      // textOutput += `<div style='display: flex; width: ${(maxTooltipWidth + 20) * columns}px;'>`;
      textOutput += `<div style='display: flex;'>`;

      for (let i = 0; i < length; i++) {
        let ttl = list[i];
        
        if (i % ROW_COUNT === 0) {
          textOutput += `<div style='display: inline-block; width: ${widthRatio}%;'>`;
        }

        let out = `<div style='text-align: center; padding-left: 5px; padding-right: 5px; '>
                    ${ttl.colorLabel}
                    ${ttl.label 
                      ? `<div style='display: inline-block; width: ${maxLabelWidth}px; text-align: left;'>
                          ${ttl.label}
                        </div><div style='display: inline-block;'>:</div>` 
                      : `<div style='display: inline-block;'></div>`}
                    <div style='display: inline-block; width: ${maxValueWidth}px; text-align: right;'>
                      ${config.tooltip.value.format(ttl.value)}  
                    </div>
                  </div>`;
        textOutput += out;

        if ((i + 1) % ROW_COUNT === 0) {
          textOutput += "</div>";
        }
      }
      textOutput += "</div>";
      textOutput += "</div>";
      textOutput += "</div>";
      
      return textOutput;
		} else {
      return null;
    }
  }

  findPlotPoint = (pos) => {
    const { mx, my } = pos;
    let that      = this;
    let ctx       = this.ctx;
    let startTime = this.startTime;
    let endTime   = this.endTime;
    let xStart    = this.chartAttr.x;
    let xEnd      = this.chartAttr.x + this.chartAttr.w;
    let config    = this.config;
    let plotPoint = this.plotPoint;

    let timeValue = tooltipCalcX(startTime, endTime, xStart, xEnd, mx);

    let ttRange = 1000;
    if (this.dots.length > 1) {
      ttRange = tooltipRange(this.dots);
    }

    let tooltipList = [];
		for (let i = 0; i < this.dots.length; i++) {
			let dot = this.dots[i];
      if (dot.time > timeValue - (ttRange / 2) && dot.time < timeValue + (ttRange / 2)) {
        tooltipList.push(dot);
      }
    }
    
    if (this.focused && this.focused.length > 0) {
      let currentDot = tooltipList.filter((el) => {
        let dot = that.focused.find((fc) => fc.id === el.id)
        if (dot) return dot;
      })
      tooltipList = currentDot;
    }

    if (tooltipList.length !== 0) {
      this.hoveredPlots = tooltipList;
      return true;
    } else {
      this.hoveredPlots = [];
      return false;
    }
  }

  getStartEndTime = (data) => {
    let config   = this.config;
    let timeDiff = config.xAxis.timeDiff;

    let dataStartTime = data[0][0];
    let dataEndTime   = data[0][0];

    let length   = data.length;
    let interval = timeDiff;

    if (length > 1) {
      interval = data[1][0] - data[0][0];
    }

    for (let i = 1; i < length; i++) {
      if (dataStartTime > data[i][0]) {
        dataStartTime = data[i][0];
      }
      if (dataEndTime < data[i][0]) {
        dataEndTime = data[i][0];
      }
      let plotDiff = data[i][0] - data[i - 1][0];
      if (plotDiff < interval) {
        interval = plotDiff;
      }
    }

    return { start: dataStartTime, end: dataEndTime, plotDiff: interval }
  }

  setTimeStandard = (limits) => {
    let config = this.config;
    let { timeDiff } = config.xAxis;

    let length = limits.length;
    let dataStart = limits[0].start;
    let dataEnd = limits[0].end;
    let interval = limits[0].plotDiff;

    for (let i = 1; i < length; i++) {
      let limit = limits[i];
      if (dataStart > limit.start) {
        dataStart = limit.start;
      }
      if (dataEnd < limit.end) {
        dataEnd = limit.end;
      }
      if (interval > limit.plotDiff) {
        interval = limit.plotDiff;
      }
    }

    // let current = new Date().getTime();
    // this.endTime = current - (current % interval);
    this.endTime = dataEnd;
    this.startTime = this.endTime - timeDiff;

    if (this.startTime < dataStart) {
      this.startTime = dataStart;
    }
    // if (this.endTime > dataEnd) {
    //   this.endTime = dataEnd;
    // }
    
  }

  // setTimeStandard = (data, idx) => {
  //   let config = this.config;
  //   let { timeDiff } = config.xAxis

  //   if (idx === 0) {
  //     let current = parseInt(new Date().getTime() / 1000) * 1000;
  //     this.endTime = current;
  //     this.startTime = current - timeDiff;
  //     this.dataStartTime = data[0][0];
  //     this.dataEndTime = data[0][0];
  //   }

  //   let length = data.length;
    
  //   for (let i = 0; i < length; i++) {
  //     if (this.dataStartTime > data[i][0]) {
  //       this.dataStartTime = data[i][0];
  //     }
  //     if (this.dataEndTime < data[i][0]) {
  //       this.dataEndTime = data[i][0];
  //     }
  //   }

  //   if (this.startTime < this.dataStartTime) {
  //     this.startTime = this.dataStartTime;
  //   }
  //   if (this.endTime > this.dataEndTime) {
  //     this.endTime = this.dataEndTime;
  //   }

  // }

  updateData = (dataset) => {
    if (!dataset) return;
    let that   = this;
    let config = this.config;
    let plots  = this.plots;
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
                break;
              case "none":
              default:
                cData.data.push(datum);
                break;
            }
          } else {
            cData.data.push(datum);
          }
          
          if (!fixedMax && datum[1] > that.maxValue ) {
            that.maxValue = getMaxValue(datum[1], plots);
            console.log(that.maxValue);
          } 
          if (!fixedMin && datum[1] < that.minValue) {
            that.minValue = datum[1];
          }
        })

        that.heapSort.sort(cData.data, false, 0);
      } else {
        let colorValue = that.palette.getColorFromId(ds.id);
        let strokeValue = CoreFunc.formatRgb(colorValue.rgb, colorValue.alpha);
        let fillValue = CoreFunc.formatRgb(colorValue, 0.2);
        that.data.put(ds.key, { id: ds.id, label: ds.label, data: ds.data1, color: strokeValue, fill: fillValue });
      }
    })

    let en = this.data.keys();
    let idx = 0;
    let timeLimits = [];
    for (let idx = 0; en.hasMoreElements(); idx++) {
      let key = en.nextElement();
      let value = this.data.get(key);

      if (value.data.length > this.maxPlot) {
        let overflow = value.data.length - this.maxPlot;
        value.data = value.data.slice(overflow);
      }
      // that.setTimeStandard(value.data, idx);
      if (value.data.length > 0) {
        let timeStartEnd = this.getStartEndTime(value.data);
        timeLimits.push(timeStartEnd);
      }
    }

    if (timeLimits.length > 0) {
      this.setTimeStandard(timeLimits)
    }

    this.drawChart();
  }

  /**
   * @private
   */
  drawData = () => {
    let that         = this;
    let ctx          = this.ctx;
		let startTime    = this.startTime;
    let endTime      = this.endTime;
    let config       = this.config;
    let theme        = this.theme;
    let plotPoint    = this.plotPoint;
    let hoveredPlots = this.hoveredPlots;
    // const { timeDiff }            = config.xAxis;
    const { disconnectThreshold, area } = config.common;
    const { x, y, w, h }          = this.chartAttr;

    ctx.save();

		let _dots = [];
    let en = this.data.keys();
    while(en.hasMoreElements()) {
      let key = en.nextElement();
      let value = this.data.get(key);
      let prevTimestamp = 0;
      let prevXCoord = 0;
      let prevYCoord = 0;

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
          yPos = 0.999;
        }
        let yCoord = y + (h * yPos);

        /**
         * plot과 plot을 이어주는 line
         */
        ctx.lineWidth = 1.5;
        if (!lineInit) {
          ctx.beginPath();
          
          ctx.strokeStyle = value.color;
          if (this.focused && this.focused.length > 0
            && this.focused.find((fc) => fc.id !== value.id)) {
						ctx.strokeStyle = theme.unselected;
					}
          ctx.moveTo(xCoord, yCoord);
          lineInit = true;
        } else {
          if (datum[0] - prevTimestamp < disconnectThreshold) {
            ctx.lineTo(xCoord, yCoord);
            ctx.stroke();

            if (area === true) {
              ctx.save();
              ctx.beginPath();
              ctx.moveTo(prevXCoord, prevYCoord);
              ctx.lineTo(prevXCoord, y + h);
              ctx.lineTo(xCoord, y + h);
              ctx.lineTo(xCoord, yCoord);
              ctx.fillStyle = value.fill;
              ctx.fill();
              ctx.restore();
            }
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
          fill: value.fill,
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
        prevXCoord = xCoord;
        prevYCoord = yCoord;
      }
      // value.data.map((datum, idx) => {
        
      // })
    }

    if (plotPoint && hoveredPlots.length > 0) {
      hoveredPlots.map((pl) => {
        ctx.beginPath();
        ctx.arc(pl.x, pl.y, pl.r, 0, 2 * Math.PI);
        ctx.fillStyle = pl.color;
        ctx.fill();
        ctx.lineWidth = 1;
        ctx.strokeStyle = "#ffffff";
        ctx.stroke();
      })
    }

    this.dots = _dots;
    ctx.restore();

  }
}

export default LineChart;
