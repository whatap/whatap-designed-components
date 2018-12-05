import moment from 'moment';

export function drawXtick (ctx, args) {
  let options = args;
  let textWidth = ctx.measureText(options.format).width;
  let { startTime, endTime, chartAttr, minOffset } = options;
  let { x, y, w, h } = chartAttr;

  let tickCount = 1;
  while ((textWidth * tickCount) + (minOffset * 2 * tickCount) < w) {
    tickCount++;
  }
  let timeDiff = (endTime - startTime) / tickCount;
  let widthInterval = w / tickCount;
  let textOffset = textWidth / 2;
  
  ctx.restore();
  for (let i = 1; i < tickCount; i++) {
    ctx.textAlign = "left";
    let timeValue = moment.unix((options.startTime + (i * timeDiff)) / 1000 ).format(options.format);
    ctx.fillText(timeValue, x + (i * widthInterval) - textOffset, y + h + 9)
  }
}

export function drawYtick (ctx, args) {
  let options = args;
  let { chartAttr, plots, maxValue, minValue } = options;
  let { x, y, w, h } = chartAttr;
  let heightInterval = h / plots;
  let tickValue = maxValue;

  ctx.save();
  for (let i = 0; i < plots + 1; i++) {
    ctx.textAlign = "right";
    ctx.fillText(tickValue, x - 2, ( y + 3 ) + (i * heightInterval));
    tickValue -= ((maxValue - minValue) / plots);
  }
  ctx.restore();
}