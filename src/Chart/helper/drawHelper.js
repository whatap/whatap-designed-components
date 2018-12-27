import { tooltipCalcX, tooltipCalcY } from '../util/positionCalc'
import { FONT_SIZE, CHART_TICK_OFFSET_Y, CHART_TICK_OFFSET_X } from '../meta/globalMeta';

export function drawHelper (ctx, chartAttr, mousePos, args) {
  const { mx, my } = mousePos;
  const { x, y, w, h } = chartAttr;
  const { startTime, endTime, maxValue, minValue, xAxisFormat, yAxisFormat } = args;

  if (my > y && my < y + h && mx > x && mx < x + w) {
    ctx.save();
    ctx.beginPath();
    ctx.setLineDash([1, 2]);
    ctx.strokeStyle = "red";
    ctx.moveTo(x, my);
    ctx.lineTo(x + w, my);
    ctx.stroke();

    ctx.beginPath();
    ctx.setLineDash([1, 2]);
    ctx.strokeStyle = "red";
    ctx.moveTo(mx, y);
    ctx.lineTo(mx, y + h);
    ctx.stroke();

    let timeValue   = tooltipCalcX(startTime, endTime, x, x + w, mx);
    ctx.strokeStyle = "black";
    ctx.fillStyle   = "white";
    let formattedX  = xAxisFormat(timeValue / 1000)
    let textWidthX  = ctx.measureText(formattedX).width + 5;
    ctx.fillRect(mx - (textWidthX / 2), y + h + CHART_TICK_OFFSET_Y, textWidthX, FONT_SIZE + CHART_TICK_OFFSET_Y);
    ctx.setLineDash([]);
    ctx.strokeRect(mx - textWidthX / 2, y + h + CHART_TICK_OFFSET_Y, textWidthX, FONT_SIZE + CHART_TICK_OFFSET_Y);
    ctx.fillStyle   = "red";
    ctx.textAlign   = "left";
    ctx.fillText(formattedX, mx - textWidthX / 2 + 1, y + h + FONT_SIZE + CHART_TICK_OFFSET_Y);

    let dataValue   = tooltipCalcY(minValue, maxValue, y, y + h, my);
    ctx.strokeStyle = "black";
    ctx.fillStyle   = "white";
    let formattedY  = yAxisFormat(parseInt(dataValue));
    let textWidthY  = ctx.measureText(yAxisFormat(maxValue)).width + 2;
    ctx.fillRect(x - textWidthY, my - CHART_TICK_OFFSET_X, textWidthY, FONT_SIZE + CHART_TICK_OFFSET_Y);
    ctx.strokeRect(x - textWidthY, my - CHART_TICK_OFFSET_X, textWidthY, FONT_SIZE + CHART_TICK_OFFSET_Y)

    ctx.textAlign   = "right";
    ctx.fillStyle   = "red";
    ctx.fillText(formattedY, x - 2, my + CHART_TICK_OFFSET_Y);

  }

  ctx.restore();
}