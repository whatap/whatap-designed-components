/**
 * WhaTap LineChart
 * created by MinGu Lee (@immigration9)
 * All rights reserved to WhaTap Labs 2018
 */
import WChart from './WChart';

class LineChart extends WChart{
  constructor(bindId, colorId, options) {
    super(bindId, colorId, options);
  }

  loadData = (dataset, dataId="data") => {
    if (!dataset) return;
    let that      = this;
    let config    = this.config;
    this.maxPlots = config.xAxis.maxPlot;
    const { minValue, maxValue, fixedMinMax }  = config.yAxis;
    
    if (fixedMinMax) {
      this.minValue = minValue;
      this.maxValue = maxValue;
    }

    let maxPlotCnt = 0;

    dataset.map((ds, idx) => {
      let colorValue = that.palette.getColorFromOid(ds.oid);

      /**
       * Sorts the inner data in ascending order.
       */
      that.heapSort.sort(ds[dataId], false, 0);

      /**
       * If not fixed Minimum / Maximum value, evaluate the data within and decide the max/min value
       */
      if (!fixedMinMax) {
        ds[dataId].map((data) => {
          if (data[1] > that.maxValue ) {
            that.maxValue = data[1];
          } else if (data[1] < that.minValue) {
            that.minValue = data[1];
          }
        })
      }

      if (ds[dataId].length > maxPlotCnt) {
        maxPlotCnt = ds[dataId].length;
      }

      that.data.put(ds.oid, { oname: ds.oname, data: ds[dataId], color: colorValue });
      /**
       * Only get the initial start time when the option is set to `isFixed=false`
       */
      if (!config.xAxis.isFixed) {
        that.setTimeStandard(ds[dataId], idx);
      }

      if (typeof this.maxPlots === 'undefined') {
        this.maxPlots = maxPlotCnt;
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

  updateData = (dataset, dataId = "data") => {
    console.log(dataset);
    if (!dataset) return;
    let that   = this;
    let config = this.config;
    const { fixedMinMax }  = config.yAxis;

    dataset.map((ds, idx) => {
      if (that.data.containsKey(ds.oid)) {
        let cData = that.data.get(ds.oid);
        ds[dataId].map((datum) => {
          cData.data.push(datum);
          
          if (!fixedMinMax) {
            if (datum[1] > that.maxValue ) {
              that.maxValue = datum[1];
            } else if (datum[1] < that.minValue) {
              that.minValue = datum[1];
            }
          }
        })

        that.heapSort.sort(cData.data, false, 0);
      } else {
        let colorValue = that.palette.getColorFromOid(ds.oid);
        that.data.put(ds.oid, { oname: ds.oname, data: ds[dataId], color: colorValue });
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
    const { disconnectThreshold } = config.common;
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
        ctx.lineWidth = 1;
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
          offset: 1,
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
