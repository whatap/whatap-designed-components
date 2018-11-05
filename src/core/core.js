export function getMinValueIndexFromArray (array) {
  if (!Array.isArray(array) && array.length === 0) {
    throw new Error("Provide a valid array to compare");
  }
  let min = array[0];
  let index = 0;
  array.map((item, idx) => {
    if (Number(item) < min) {
      min = item;
      index = idx;
    }
  })
  return { min, index };
}

export function formatRgb(rgb, alpha) {
  if (!Array.isArray(rgb) && rgb.length < 3) {
    throw new Error("Invalid array value");
  }
  if (alpha) {
    return `rgba(${rgb[0]},${rgb[1]},${rgb[2]},${alpha})`
  } else {
    return `rgb(${rgb[0]},${rgb[1]},${rgb[2]})`
  }
}