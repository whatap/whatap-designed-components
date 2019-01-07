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
    
    defaultPalette.forEach((dp, idx) => {
      that.colorList.push({
        id: idx,
        color: dp.color,
        hex: dp.hex,
        rgb: dp.rgb,
        alpha: dp.alpha,
        rgbStr: CoreFunc.formatRgb(dp.rgb, dp.alpha),
        list: [],
      })
    })
  }

  addCustomColor = (item) => {
    let lastId = this.colorList[this.colorList.length - 1].id
    this.colorList.push({
      id: lastId + 1,
      color: item.color,
      hex: item.hex,
      rgb: item.rgb,
      rgbStr: CoreFunc.formatRgb(item.rgb),
      list: [],
    })
  }

  removeColor = (id) => {
    this.colorList = this.colorList.filter((color) => {
      return color.id !== id;
    })
  }

  listAllColors = () => {
    return this.colorList;
  }

  getColorFromId = (key) => {
    if (key === -1) return { rgb: nonInstanceColor.rgb, alpha: nonInstanceColor.alpha };

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
      return { rgb: newColor, alpha: color.alpha };
    } else {
      color.list.push(key);
      return { rgb: color.rgb, alpha: color.alpha };
    }
  }
}

const instance = new ColorSelector();
Object.freeze(instance);
export default instance;