export function dataValidation(startTime, endTime) {
  if (startTime > endTime) {
    console.log("timestamp incorrect: " + startTime + " / " + endTime);
    return false;
  }

  return true;
}