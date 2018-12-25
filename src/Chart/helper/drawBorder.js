import { timeToPos } from '../util/positionCalc'
import calculateDiff from '../meta/plotMeta';

export function drawXplot (ctx, args) {
  let options = args;
  let textWidth = ctx.measureText(options.format).width;
  let { startTime, endTime, chartAttr, minOffset, xPlotLine, theme } = options;
  let { x, y, w, h } = chartAttr;

  let timeDiff = endTime - startTime;
  let interval = calculateDiff(timeDiff);
  let current = startTime - (startTime % interval) + interval;
  let plots = [];

  while (current < endTime) {
    let pos = timeToPos(startTime, endTime, x, x + w, current);

    plots.push(pos);
    current += interval;
  }

  ctx.save();
  plots.map((pl) => {
    ctx.beginPath();
    ctx.setLineDash([1, 2]);
    // ctx.strokeStyle = xPlotLine.color;
    ctx.strokeStyle = theme.plotLine;
    ctx.moveTo(pl, y);
    ctx.lineTo(pl, y + h);
    ctx.stroke();
  })
  ctx.restore();
}

export function drawYplot (ctx, args) {
  let options = args;
  let { chartAttr, plots, yPlotLine, theme } = options;
  let { x, y, w, h } = chartAttr;
  let heightInterval = h / plots;

  ctx.save();
  for (let i = 0; i < plots + 1; i++) {
    ctx.beginPath();
    ctx.setLineDash([1, 2]);
    // ctx.strokeStyle = yPlotLine.color;
    ctx.strokeStyle = theme.plotLine;
    ctx.moveTo(x, y + (i * heightInterval));
    ctx.lineTo(x + w, y + (i * heightInterval));
    ctx.stroke();
  }
  ctx.restore();
}

export function drawXaxis (ctx, args) {
  let options = args;
  let { xAxisLine, chartAttr, theme } = options;
  let { x, y, w, h } = chartAttr;
  
  ctx.save();

  ctx.beginPath();
  // ctx.strokeStyle = xAxisLine.color;
  ctx.strokeStyle = theme.axisLine;
  ctx.moveTo(x, y + h);
  ctx.lineTo(x + w, y + h);
  ctx.stroke();

  ctx.restore();
}

export function drawYaxis (ctx, args) {
  let options = args;
  let { yAxisLine, chartAttr, theme } = options;
  let { x, y, w, h } = chartAttr;
  
  ctx.save();

  ctx.beginPath();
  // ctx.strokeStyle = yAxisLine.color;
  ctx.strokeStyle = theme.axisLine;
  ctx.moveTo(x, y);
  ctx.lineTo(x, y + h);
  ctx.stroke();

  ctx.restore();
}

// export function drawXplot (ctx, args) {
//   let options = args;
//   let textWidth = ctx.measureText(options.format).width;
//   let { startTime, endTime, chartAttr, minOffset, xPlotLine } = options;
//   let { x, y, w, h } = chartAttr;

//   let tickCount = 1;
//   while ((textWidth * tickCount) + (minOffset * 2 * tickCount) < w) {
//     tickCount++;
//   }
//   let timeDiff = (endTime - startTime) / tickCount;
//   let widthInterval = w / tickCount;
//   let textOffset = textWidth / 2;

//   ctx.save();
//   for (let i = 1; i < tickCount; i++) {
//     ctx.beginPath();
//     ctx.setLineDash([1, 2]);
//     ctx.strokeStyle = xPlotLine.color;
//     ctx.moveTo(x + (i * widthInterval), y);
//     ctx.lineTo(x + (i * widthInterval), y + h);
//     ctx.stroke();
//   }
//   ctx.restore();
// }