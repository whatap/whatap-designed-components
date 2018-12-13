const ttCalcX = (startTime, endTime, startPos, endPos, mousePosX) => {
  let timeDiff  = endTime - startTime;
  let posDiff   = endPos - startPos;
  let timeValue = (timeDiff * (mousePosX - startPos)) / posDiff + startTime;

  return parseInt(timeValue);
}

const ttCalcY = (minValue, maxValue, startPos, endPos, mousePosY) => {

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

export { ttCalcX, ttCalcY, ttRange }