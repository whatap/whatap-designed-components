import moment from 'moment';
import calculateDiff from '../meta/plotMeta'
import { timeToPos } from '../util/positionCalc';
import { FONT_SIZE, CHART_TICK_OFFSET_Y, CHART_TICK_SPACE } from '../meta/globalMeta'

const UNIX_TIMESTAMP = 1000;

export function drawXtick (ctx, args) {
  let options = args;
  let { startTime, endTime, chartAttr, minOffset, theme } = options;
  let { x, y, w, h } = chartAttr;

  let textLength = "";
  let formatType = "string";
  if (typeof options.format === "function") {
    formatType = "function";
    textLength = options.format(new Date().getTime() / UNIX_TIMESTAMP);
  } else {
    textLength = options.format;
  }
  
  let textWidth = ctx.measureText(textLength).width;
  let totalPlotCnt = (w / textWidth).toFixed(2);
  let textOffset = textWidth / 2;

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
  ctx.fillStyle = theme.tick;
  ctx.textAlign = "left";

  let divisor = 1;
  let plotCount = plots.length * 1.2;
  while (plotCount > totalPlotCnt) {
    divisor += 1;
    plotCount /= 2;
  }

  plots.map((pl, idx) => {
    if (idx % divisor === 0) {
      let timeValue;
      if (formatType === "function") {
        timeValue = options.format(pl[0] / UNIX_TIMESTAMP)
      } else {
        timeValue = moment.unix(pl[0] / UNIX_TIMESTAMP).format(textLength);
      }
      ctx.fillText(timeValue, pl[1] - textOffset, y + h + FONT_SIZE + CHART_TICK_OFFSET_Y);
    }
  })
  ctx.restore();
}

/**
 * TODO: `drawYtick` 관련 로직 수정 필요 
 * yPlot 정수로 dynamic하게 떨어지도록 수정
 */
export function drawYtick (ctx, args) {
  let options = args;
  let { chartAttr, plots, maxValue, minValue, format, theme } = options;
  let { x, y, w, h } = chartAttr;
  let heightInterval = h / plots;
  let tickValue = maxValue;

  ctx.save();
  ctx.fillStyle = theme.tick;
  ctx.textAlign = "right";
  for (let i = 0; i < plots + 1; i++) {
    let formattedY = format(tickValue);

    ctx.fillText(formattedY, x - CHART_TICK_SPACE, ( y + 3 ) + (i * heightInterval));
    tickValue -= ((maxValue - minValue) / plots);
  }
  ctx.restore();
}