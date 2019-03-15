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
    const { ctx, config, total, bcRect, data } = this;
    const semiCircle = config.semiCircle;
    const title = config.title || 'Data';
    ctx.save();
    const width = bcRect.width; // Canvas Width 
    const circleWidth = 0.3; // Cirle weight 0 ~ 1
    const halfWidth = width/2;
    const x = halfWidth; // Center of circle xAxis
    const height = bcRect.height; // Canvas Height
    const halfHeight = height/2;
    const y = semiCircle ? height : halfHeight; // Center of circle yAxis
    const diameter = semiCircle ? (width > height * 2 ? height * 2 : width) : (width > height ? height : width); // Diameter of circle
    const textMax = diameter * (0.9 - circleWidth) // Text Wrapper Width
    const lengthPI = semiCircle ? Math.PI : Math.PI*2; 
    const radius = diameter/2;
    const circleInner = radius * 0.7; // Use to draw the inner line of circle

    ctx.clearRect(0, 0, width, height);
    let en = data.keys();

    let thisRadian = semiCircle ? Math.PI : Math.PI/2;
    if(!total){ // totla === 0 || data empty
      ctx.beginPath();
      ctx.fillStyle = "rgba(216, 216, 216, 1)";
      const nextRadian = thisRadian + Math.PI*2;
      ctx.arc(x, y, radius, thisRadian, nextRadian, false);
      ctx.arc(x, y, circleInner, nextRadian, thisRadian, true);
      ctx.fill();
    }else{
      while(en.hasMoreElements()){ //Draw arc
        const key = en.nextElement();
        const value = data.get(key);
        const percent = value.data/total;
        const nextRadian = thisRadian + lengthPI * percent;
        ctx.beginPath();
        ctx.fillStyle = value.color;
        ctx.arc(x, y, radius, thisRadian, nextRadian, false);
        ctx.arc(x, y, circleInner, nextRadian, thisRadian, true);
        ctx.fill();
  
        thisRadian = nextRadian;
      }
    }

    ctx.font = `13px ${FONT_TYPE}`;
    ctx.textAlign = "center";
    ctx.fillStyle = "rgba(0, 0, 0, 1)";

    let lineHeight = 13 * 1.286;
    let words = title.split(' ');
    let line = '';
    let textY = y + (semiCircle ? -15 : 6);
    const wordsLength = words.length;
    let newLine = false;
    for(let i = 0; i < wordsLength; i++){ //Long text \n function 
      const testLine = line + words[i] + ' ';
      const metrics = ctx.measureText(testLine);
      const testWidth = metrics.width;

      if(testWidth > textMax && line !== ''){ // max 2 line
        ctx.fillText(line, x, textY - (lineHeight/2));
        ctx.fillText(title.replace(line, ''), x, textY + (lineHeight/2));
        newLine = true;
        break;
      }else{
        line = testLine;
      }
    }

    if(!newLine){
      ctx.fillText(title, x, textY);
    }

    ctx.restore();
  }

  // resizeCanvas = (mainDiv, cvHeight) => {
  //   console.log('resizeCanvas !!! ', mainDiv, cvHeight);
  // }
}

export default ArcChart;