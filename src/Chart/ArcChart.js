/**
 * Whatap ArcChart
 * created by SungChul Won
 * All rights reserved to WhaTap Labs 2018
 */

import AbstractChart from './AbstractChart';
import { CoreFunc } from '../core';
import { FONT_SIZE, FONT_TYPE } from './meta/globalMeta';
import { getScreenRatio } from './util/displayModulator';

class ArcChart extends AbstractChart{
  constructor(bindId, options){
    super(bindId, options);

    this.initCanvas();
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
  }

  setTheme = (theme) => {
    if(typeof theme === 'undefined' || this.themePalette[theme] === 'undefined'){
      theme = 'wh';
    }

    this.theme = this.themePalette[theme];
    this.themeId = theme;
  }

  loadData = (dataset) => {
    const that = this;
    const themeId = this.themeId;
    this.total = 0;
    
    if(dataset.length > 0){
      this.data.clear();
      dataset.forEach((ds, idx) => {
        let colorValue = that.palette.getColorFromId(ds.id, themeId);
        let strokeValue = CoreFunc.formatRgb(colorValue.rgb, colorValue.alpha);
        let fillValue = CoreFunc.formatRgb(colorValue.rgb, 0.2);

        this.total += ds.data;
        that.data.put(ds.key, { id: ds.id, label: ds.label, data: ds.data, color: strokeValue, fill: fillValue });
      })
    }

    this.drawChart();
  }

  drawChart = () => {
    const ctx = this.ctx;
    ctx.save();
    const width = this.bcRect.width;
    const halfWidth = width/2;
    const height = this.bcRect.height;
    const halfHeight = height/2;
    const diameter = width > height ? height : width;
    const doublePI = Math.PI*2;
    const radius = diameter/2;
    const circleInner = radius * 0.7;

    ctx.clearRect(0, 0, width, height);
    let en = this.data.keys();

    let thisRadian = Math.PI/2;
    while(en.hasMoreElements()){
      const key = en.nextElement();
      const value = this.data.get(key);
      const percent = value.data/this.total;
      const nextRadian = thisRadian + doublePI * percent;
      ctx.beginPath();
      ctx.fillStyle = value.color;
      ctx.arc(halfWidth, halfHeight, radius, thisRadian, nextRadian, false);
      ctx.arc(halfWidth, halfHeight, circleInner, nextRadian, thisRadian, true);
      ctx.fill();

      thisRadian = nextRadian;
    }

    ctx.font = `13px ${FONT_TYPE}`;
    ctx.textAlign = "center";
    ctx.fillStyle = "rgba(0, 0, 0, 1)";
    ctx.fillText(this.config.title, halfWidth, halfHeight + 6);

    ctx.restore();
  }

  // resizeCanvas = (mainDiv, cvHeight) => {
  //   console.log('resizeCanvas !!! ', mainDiv, cvHeight);
  // }
}

export default ArcChart;