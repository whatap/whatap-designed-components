export function drawXplot (ctx, args) {
  let options = args;
  let textWidth = ctx.measureText(options.format).width;
  let { startTime, endTime, chartAttr, minOffset, xPlotLine } = options;
  let { x, y, w, h } = chartAttr;

  let tickCount = 1;
  while ((textWidth * tickCount) + (minOffset * 2 * tickCount) < w) {
    tickCount++;
  }
  let timeDiff = (endTime - startTime) / tickCount;
  let widthInterval = w / tickCount;
  let textOffset = textWidth / 2;

  ctx.save();
  for (let i = 1; i < tickCount; i++) {
    ctx.beginPath();
    ctx.setLineDash([1, 2]);
    ctx.strokeStyle = xPlotLine.color;
    ctx.moveTo(x + (i * widthInterval), y);
    ctx.lineTo(x + (i * widthInterval), y + h);
    ctx.stroke();
  }
  ctx.restore();
}

export function drawYplot (ctx, args) {
  let options = args;
  let { chartAttr, plots, maxValue, minValue, yPlotLine } = options;
  let { x, y, w, h } = chartAttr;
  let heightInterval = h / plots;
  let tickValue = maxValue;

  ctx.save();
  for (let i = 0; i < plots + 1; i++) {
    ctx.beginPath();
    ctx.setLineDash([1, 2]);
    ctx.strokeStyle = yPlotLine.color;
    ctx.moveTo(x, y + (i * heightInterval));
    ctx.lineTo(x + w, y + (i * heightInterval));
    ctx.stroke();
  }
  ctx.restore();
}

export function drawXaxis (ctx, args) {
  let options = args;
  let { xAxisLine, chartAttr } = options;
  let { x, y, w, h } = chartAttr;
  
  ctx.save();

  ctx.beginPath();
  ctx.strokeStyle = xAxisLine.color;
  ctx.moveTo(x, y + h);
  ctx.lineTo(x + w, y + h);
  ctx.stroke();

  ctx.restore();
}

export function drawYaxis (ctx, args) {
  let options = args;
  let { yAxisLine, chartAttr } = options;
  let { x, y, w, h } = chartAttr;
  
  ctx.save();

  ctx.beginPath();
  ctx.strokeStyle = yAxisLine.color;
  ctx.moveTo(x, y);
  ctx.lineTo(x, y + h);
  ctx.stroke();

  ctx.restore();
}