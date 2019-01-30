import { PLOT_STANDARD } from '../meta/globalMeta';
import { calculateMinimum } from '../meta/plotMeta';

const tooltipCalcX = (startTime, endTime, startPos, endPos, mousePosX) => {
  let timeDiff  = endTime - startTime;
  let posDiff   = endPos - startPos;
  let timeValue = (timeDiff * (mousePosX - startPos)) / posDiff + startTime;

  return parseInt(timeValue);
}

const tooltipCalcY = (minValue, maxValue, startPos, endPos, mousePosY) => {
  let valueDiff = maxValue - minValue;
  let posDiff   = endPos - startPos;
  let value     = maxValue - (valueDiff * (mousePosY - startPos) / posDiff );
  
  return value;
}

const tooltipRange = (dots) => {
  let minimumtooltipRange = dots[1].time - dots[0].time;
  
  for (let i = 2; i < dots.length; i++) {
    let currenttooltipRange = dots[i].time - dots[i - 1].time;
    if (currenttooltipRange > 0) {
      if (currenttooltipRange < minimumtooltipRange) {
        minimumtooltipRange = currenttooltipRange;
      }  
    }
  }

  return minimumtooltipRange;
}

const timeToPos = (startTime, endTime, startPos, endPos, time) => {
  let timeDiff = endTime - startTime;
  let posDiff  = endPos - startPos;

  let posValue = (posDiff * (time - startTime)) / timeDiff + startPos;

  return posValue;
}

const calculatePlots = (height) => {
  return parseInt(height / PLOT_STANDARD);
}

// const getMaxValue = (data, plots) => {
//   let current       = plots;
//   let expectedMax   = parseInt(data * 1.1);
//   let maxDigits  = expectedMax.toString().length - 1;

//   /**
//    * 네 자리 이상의 경우, 처리 단위를 올린다.
//    */
//   let roundDigits = maxDigits > 4 ? maxDigits : maxDigits - 1;
//   let expectedRound = Math.pow(10, roundDigits);
//   let threshold     = parseInt(data * 2 / plots);

//   for (let i = 0; i < threshold; i++) {
//     current += plots;
//     if (current > expectedMax && current % expectedRound === 0) {
//       break;
//     }
//   }

//   return current;
// }


const getMaxValue = (data, plots) => {
  return calculateMinimum(data, plots) * plots;
}


export { tooltipCalcX, tooltipCalcY, tooltipRange, timeToPos, getMaxValue, calculatePlots }