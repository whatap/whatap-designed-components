export function dataValidation(startTime, endTime) {
  if (startTime > endTime) {
    return false;
  }

  return true;
}