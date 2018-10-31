const palette = {
  blue: '#329af0',
  royalBlue: '#1565c0',
  darkBlue: '#1a237e',
  yellow: '#f2de22',
  orange: '#ff9d33',
  red: '#ff5f5f',
  purple: '#845ef7',
  teal: '#00b7d0',
  seaGreen: '#0ee5b1',
  periwinkle: '#748ffc',
  lightBlue: '#72c3fc',
  gray: '#b5bdc4',
  mustard: '#f3c339',
  green: '#06c606',
  lightPurple: '#bc83ff',
  pink: '#ff95fb',
  paleGreen: '#a1e5ac',
  errorBlack: '#000000'
}

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

class ColorPicker {
  constructor() {
    this.color = palette.errorBlack;
  }

  fromInteger(value) {
    let calVal = Math.abs(value);
    let rgb = [0, 0, 0];

    let pos = 0;
    while (calVal > 0 ) {
      rgb[pos % 3] += (calVal % 1000);
      calVal /= 1000;
      pos += 1;
    }
    for (let i = 0; i < 3; i++) {
      rgb[i] = Number(rgb[i] % 256).toFixed(0);
    }
    let rgbVal = `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, 1)`;
    return rgbVal;
  }

  fromString(value, hash) {
    let hashedValue;
    if (hash) {
      hashedValue = value;
    } else {
      hashedValue = HashString(value);
    }
    return this.fromInteger(hashedValue);
  }

  fromPalette(value) {
    if (palette[value]) {
      this.color = palette[value];
    } else {
      this.color = palette.errorBlack;
      console.log(`Palette does not have the color ${value}`);
    }
    return this.color;
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
      this.color = fromString(value);
    }
  }

  printPalette() {
    for ( color in palette ) {
      if (palette.hasOwnProperty(color)) {
        console.log(`${color}: ${palette[color]}`);
      }
    }
  }
}

export default ColorPicker;