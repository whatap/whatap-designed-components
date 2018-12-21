
const ttCalcX = (startTime, endTime, startPos, endPos, mousePosX) => {
  let timeDiff  = endTime - startTime;
  let posDiff   = endPos - startPos;
  let timeValue = (timeDiff * (mousePosX - startPos)) / posDiff + startTime;

  return parseInt(timeValue);
}

const ttCalcY = (minValue, maxValue, startPos, endPos, mousePosY) => {
  let valueDiff = maxValue - minValue;
  let posDiff   = endPos - startPos;
  let value     = maxValue - (valueDiff * (mousePosY - startPos) / posDiff );
  
  return value;
}

const ttRange = (dots) => {
  let minimumTtRange = dots[1].time - dots[0].time;
  
  for (let i = 2; i < dots.length; i++) {
    let currentTtRange = dots[i].time - dots[i - 1].time;
    if (currentTtRange > 0) {
      if (currentTtRange < minimumTtRange) {
        minimumTtRange = currentTtRange;
      }  
    }
  }

  return minimumTtRange;
}

const timeToPos = (startTime, endTime, startPos, endPos, time) => {
  let timeDiff = endTime - startTime;
  let posDiff  = endPos - startPos;

  let posValue = (posDiff * (time - startTime)) / timeDiff + startPos;

  return posValue;
}

/**
 * TODO: `getMaxValue` 관련 로직 수정 필요
 */
const getMaxValue = (data) => {
  let current = data;
  let units = 1;
  while (parseInt(current / units) !== 0) {
    units *= 10;
    current /= 10;
  }

  let dataDividedByTen = units / 10 > 1 ? units / 10 : 1;

  return data - (data % dataDividedByTen) + (dataDividedByTen * 5);
}

export { ttCalcX, ttCalcY, ttRange, timeToPos, getMaxValue }