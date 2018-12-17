import moment from 'moment';
import calculateDiff from '../meta/plotMeta'
import { timeToPos } from '../util/positionCalc';


export function drawXtick (ctx, args) {
  let options = args;
  let textWidth = ctx.measureText(options.format).width;
  let textOffset = textWidth / 2;
  let { startTime, endTime, chartAttr, minOffset } = options;
  let { x, y, w, h } = chartAttr;

  let timeDiff = endTime - startTime;
  let interval = calculateDiff(timeDiff);
  let current = startTime - (startTime % interval) + interval;
  let plots = [];

  while (current < endTime) {
    /**
     * plot = [time, pos]
     */
    let pos = timeToPos(startTime, endTime, x, x + w, current);

    plots.push([ current, pos ]);
    current += interval;
  }
  ctx.save();
  ctx.fillStyle = "black"
  ctx.textAlign = "left";
  plots.map((pl) => {
    console.log(pl);
    let timeValue = moment.unix(pl[0] / 1000).format(options.format);
    ctx.fillText(timeValue, pl[1] - textOffset, y + h + 9);
  })
  ctx.restore();
}



export function drawYtick (ctx, args) {
  let options = args;
  let { chartAttr, plots, maxValue, minValue } = options;
  let { x, y, w, h } = chartAttr;
  let heightInterval = h / plots;
  let tickValue = maxValue;

  ctx.save();
  ctx.fillStyle = "black";
  ctx.textAlign = "right";
  for (let i = 0; i < plots + 1; i++) {
    ctx.fillText(tickValue, x - 2, ( y + 3 ) + (i * heightInterval));
    tickValue -= ((maxValue - minValue) / plots);
  }
  ctx.restore();
}

// export function drawXtick (ctx, args) {
//   let options = args;
//   let textWidth = ctx.measureText(options.format).width;
//   let { startTime, endTime, chartAttr, minOffset } = options;
//   let { x, y, w, h } = chartAttr;

//   let tickCount = 1;
//   while ((textWidth * tickCount) + (minOffset * 2 * tickCount) < w) {
//     tickCount++;
//   }
//   let timeDiff = (endTime - startTime) / tickCount;
//   let widthInterval = w / tickCount;
//   let textOffset = textWidth / 2;
  
//   ctx.restore();
//   for (let i = 1; i < tickCount; i++) {
//     ctx.textAlign = "left";
//     let timeValue = moment.unix((options.startTime + (i * timeDiff)) / 1000 ).format(options.format);
//     ctx.fillText(timeValue, x + (i * widthInterval) - textOffset, y + h + 9)
//   }
// }
