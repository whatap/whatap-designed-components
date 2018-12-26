export const MILLISECONDS = 1000;

export const SEC_IN_MILLIS = 1 * MILLISECONDS;
export const TWO_SEC_IN_MILLIS = 2 * SEC_IN_MILLIS;
export const FIVE_SEC_IN_MILLIS = 5 * MILLISECONDS;
export const TEN_SEC_IN_MILLIS = 10 * SEC_IN_MILLIS;
export const THIRTY_SEC_IN_MILLIS = 30 * SEC_IN_MILLIS;

export const MIN_IN_MILLIS = 60 * SEC_IN_MILLIS;
export const TWO_MIN_IN_MILLIS = 2 * MIN_IN_MILLIS;
export const FIVE_MIN_IN_MILLIS = 5 * MIN_IN_MILLIS;
export const TEN_MIN_IN_MILLIS = 10 * MIN_IN_MILLIS;
export const THIRTY_MIN_IN_MILLIS = 30 * MIN_IN_MILLIS;

export const HOUR_IN_MILLIS = 60 * MIN_IN_MILLIS;
export const TWO_HOUR_IN_MILLIS = 2 * HOUR_IN_MILLIS;
export const THREE_HOUR_IN_MILLIS = 3 * HOUR_IN_MILLIS;
export const FOUR_HOUR_IN_MILLIS = 4 * HOUR_IN_MILLIS;
export const SIX_HOUR_IN_MILLIS = 6 * HOUR_IN_MILLIS;
export const TWELVE_HOUR_IN_MILLIS = 12 * HOUR_IN_MILLIS;

export const DAY_IN_MILLIS = 24 * HOUR_IN_MILLIS;
export const THREE_DAY_IN_MILLIS = 3 * DAY_IN_MILLIS;
export const SEVEN_DAY_IN_MILLIS = 7 * DAY_IN_MILLIS;

export const MONTH_IN_MILLIS = 30 * DAY_IN_MILLIS;

export const FULL_DATE_TIME = "YY/MM/DD HH:mm";
export const FULL_DATE = "YY/MM/DD";
export const FULL_TIME = "HH:mm:ss";

export const MONTH_DATE_HOUR = "MM/DD HH";
export const DATE_HOUR = "DD일 HH시";
export const DATE_HOUR_MINUTE = "DD일 HH:mm";

export const HOUR_MINUTE = "HH:mm";
export const MINUTE_SECOND = "mm:ss";

export default function calculateDiff (diff) {
  if      (diff > MONTH_IN_MILLIS) {
    return SEVEN_DAY_IN_MILLIS;
  }
  else if (diff > SEVEN_DAY_IN_MILLIS) {
    return DAY_IN_MILLIS;
  } 
  else if (diff > THREE_DAY_IN_MILLIS) {
    return TWELVE_HOUR_IN_MILLIS;
  }
  else if (diff > DAY_IN_MILLIS) {
    return FOUR_HOUR_IN_MILLIS;
  }
  else if (diff > TWELVE_HOUR_IN_MILLIS) {
    return TWO_HOUR_IN_MILLIS;
  }
  else if (diff > SIX_HOUR_IN_MILLIS) {
    return HOUR_IN_MILLIS;
  }
  else if (diff > THREE_HOUR_IN_MILLIS) {
    return THIRTY_MIN_IN_MILLIS;
  }
  else if (diff > HOUR_IN_MILLIS) {
    return TEN_MIN_IN_MILLIS
  }
  else if (diff > THIRTY_MIN_IN_MILLIS) {
    return FIVE_MIN_IN_MILLIS
  }
  else if (diff > TEN_MIN_IN_MILLIS) {
    return TWO_MIN_IN_MILLIS;
  }
  else if (diff > FIVE_MIN_IN_MILLIS) {
    return MIN_IN_MILLIS;
  }
  else if (diff > TWO_MIN_IN_MILLIS) {
    return THIRTY_SEC_IN_MILLIS;
  }
  else if (diff > MIN_IN_MILLIS) {
    return TEN_SEC_IN_MILLIS;
  }
  else if (diff > THIRTY_SEC_IN_MILLIS) {
    return FIVE_SEC_IN_MILLIS;
  }
  else if (diff > TEN_SEC_IN_MILLIS) {
    return TWO_SEC_IN_MILLIS;
  }
  else {
    return diff;
  }
}

export function calculateFormat (diff) {
  if      (diff >= MONTH_IN_MILLIS) {
    return FULL_DATE;
  }
  else if (diff >= SEVEN_DAY_IN_MILLIS) {
    return DATE_HOUR;
  } 
  else if (diff >= THREE_DAY_IN_MILLIS) {
    return DATE_HOUR;
  }
  else if (diff >= DAY_IN_MILLIS) {
    return DATE_HOUR_MINUTE;
  }
  else if (diff >= TWELVE_HOUR_IN_MILLIS) {
    return HOUR_MINUTE;
  }
  else if (diff >= SIX_HOUR_IN_MILLIS) {
    return HOUR_MINUTE;
  }
  else if (diff >= THREE_HOUR_IN_MILLIS) {
    return HOUR_MINUTE;
  }
  else if (diff >= HOUR_IN_MILLIS) {
    return HOUR_MINUTE
  }
  else if (diff >= THIRTY_MIN_IN_MILLIS) {
    return HOUR_MINUTE
  }
  else if (diff >= TEN_MIN_IN_MILLIS) {
    return HOUR_MINUTE;
  }
  else if (diff >= FIVE_MIN_IN_MILLIS) {
    return FULL_TIME;
  }
  else if (diff >= TWO_MIN_IN_MILLIS) {
    return MINUTE_SECOND;
  }
  else if (diff >= MIN_IN_MILLIS) {
    return MINUTE_SECOND;
  }
  else if (diff >= THIRTY_SEC_IN_MILLIS) {
    return MINUTE_SECOND;
  }
  else if (diff >= TEN_SEC_IN_MILLIS) {
    return MINUTE_SECOND;
  }
  else {
    return FULL_TIME;
  }
}