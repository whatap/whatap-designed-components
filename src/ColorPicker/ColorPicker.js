const errorBlack = '#000000';

const HEXADECIMAL_MAX = 256; // 16 * 16

export function HashString(str) {
  let hash = 0;
  if (typeof str === 'undefined' || str.length === 0) return hash;
  for (let i = 0; i < str.length; i++) {
    let char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
}

export default class ColorPicker {
  constructor() {
    this.color = errorBlack;
  }

  fromInteger(value, typeString = true, alpha) {
    let calVal = Math.abs(value);
    let rgb = [0, 0, 0, 0];

    let pos = 0;
    while (calVal > 0 ) {
      rgb[pos % 3] += (calVal % 1000);
      calVal /= 1000;
      pos += 1;
    }
    for (let i = 0; i < 3; i++) {
      rgb[i] = Number(rgb[i] % 256).toFixed(0);
    }

    if (alpha) {
      rgb.push(Number(alpha));
    }

    if (typeString) {
      if (alpha) {
        return `rgba(${rgb[0]},${rgb[1]},${rgb[2]},${alpha})`;
      } else {
        return `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
      }
    } else {
      return rgb;
    }
  }

  fromString(value, typeString, hash) {
    let hashedValue;
    if (hash) {
      hashedValue = value;
    } else {
      hashedValue = HashString(value);
    }
    return this.fromInteger(hashedValue, typeString);
  }

  getStoreColor() {
    return this.color;
  }

  setStoreColor(value) {
    if (typeof value !== 'string' && value.length === 0) return;
    
    if (value[0] === '#') {
      this.color = value;
    } else if (value.slice(0, 3) === 'rgb') {
      this.color = value;
    } else {
      this.color = this.fromString(value);
    }
  }

  /**
   * Converts Hex (#000000, #AA000000) value to RGB (rgb(0, 0, 0), rgba(0, 0, 0, 0))
   * @param {string} hex 
   */
  hexToRgb(hex) {
    if (typeof hex !== 'string' && hex.length === 0) return;
    let color;
    let hasAlpha = false;
    let rgb = [0, 0, 0, 0];
    if (hex[0] === '#')   hex = hex.slice(1);
    if (hex.length > 7) {
      rgb[3] = parseInt(hex.slice(0, 2), 16) / HEXADECIMAL_MAX;
      hex = hex.slice(2);
      hasAlpha = true;
    }

    rgb[0] = parseInt(hex.slice(0, 2), 16);
    rgb[1] = parseInt(hex.slice(2, 4), 16);
    rgb[2] = parseInt(hex.slice(4, 6), 16);

    if (hasAlpha) {
      color = `rgba(${rgb[0]},${rgb[1]},${rgb[2]},${rgb[3]})`
    } else {
      color = `rgb(${rgb[0]},${rgb[1]},${rgb[2]})`
    }
    this.color = color;
    return color;
  }

  /**
   * Converts RGB (rgb(0, 0, 0), rgba(0, 0, 0, 0)) value to hex value (#000000, #AA000000)
   * @param {string} rgb 
   */
  // rgbToHex(rgb) {
  //   const RGB_REGEX = /(rgb|rgba)\((\d{1,3}),(\d{1,3}),(\d{1,3})(,?.?{1,3}?)\)/;
  //   if (typeof rgb !== 'string' && value.length === 0) return;
  //   let rgb_str = rgb.replace(/\s+/g, '');
  //   console.log(rgb_str)
  //   let regex = RGB_REGEX.test(rgb_str)
  //   console.log(regex);
  //   if (regex) {
  //     let rgb_out = "#";
  //     let rgb_arr = rgb_str.split("(");
  //     rgb_arr = rgb_str[1].split(")");
  //     rgb_arr = rgb_str[0].split(",");
  //     console.log(rgb_arr);
  //     if (rgb_arr.length === 4) {
  //       let alpha = (parseFloat(rgb_arr[3]) * 100).toFixed(0)
  //       rgb_out = rgb_out.concat(alpha.toString(16));
  //     }
  //     for (let i = 0; i < 3; i++) {
  //       // https://stackoverflow.com/questions/57803/how-to-convert-decimal-to-hex-in-javascript
  //       let hexadecimal_value = Number(rgb_arr[i]).toString(16);
  //       rgb_out = rgb_out.concat(hexadecimal_value);
  //     } 
  //     this.color = rgb_out;
  //     return rgb_out;
  //   } else {
  //     this.color = palette.errorBlack;
  //     return palette.errorBlack;
  //   }
  // }
}