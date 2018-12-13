const ttCalcX = (startTime, endTime, startPos, endPos, mousePosX) => {
  let timeDiff  = endTime - startTime;
  let posDiff   = endPos - startPos;
  let timeValue = (timeDiff * (mousePosX - startPos)) / posDiff + startTime;

  return parseInt(timeValue);
}

const ttCalcY = (minValue, maxValue, startPos, endPos, mousePosY) => {

}

export { ttCalcX, ttCalcY }