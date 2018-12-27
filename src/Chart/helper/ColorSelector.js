import { defaultPalette, nonInstanceColor } from '../meta/colorMeta';
import { CoreFunc } from '../../core';

class ColorSelector {
  constructor() {
    if (this.instance) {
      return this.instance;
    }
    this.hash      = Math.random() * 1000;
    this.instance  = this;
    this.colorList = [];
    let that       = this;
    
    defaultPalette.forEach((dp) => {
      that.colorList.push({
        color: dp.color,
        hex: dp.hex,
        rgb: dp.rgb,
        rgbStr: CoreFunc.formatRgb(dp.rgb),
        list: [],
      })
    })
  }

  getColorFromId = (key) => {
    if (key === -1) return nonInstanceColor.hex;

    let current = Math.abs(key) % defaultPalette.length;
    let color   = this.colorList[current];

    if (color && color.list.includes(key)) {
      let currentPos = color.list.indexOf(key);
      let newColor = [ ...color.rgb ];

      for (let i = 0; i < currentPos; i++) {
        let minIndex = CoreFunc.getMinValueIndexFromArray(newColor).index;
        newColor = newColor.map((el, idx) => {
          if (idx === minIndex) return (el + 10) % 256;
          else return el;
        })
      }
      return CoreFunc.formatRgb(newColor);
    } else {
      color.list.push(key);
      return color.rgbStr;
    }
  }
}

const instance = new ColorSelector();
Object.freeze(instance);
export default instance;