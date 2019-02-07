import { defaultPalette, nonInstanceColor } from '../meta/colorMeta';
import { CoreFunc } from '../../core';
import { Singleton } from '../../core'

class ColorSelector extends Singleton{
  constructor() {
    super();
    let that       = this;
    this.hash      = Math.random() * 1000;
    this.colorList = {};
    
    for (let theme in defaultPalette) {
      if (defaultPalette.hasOwnProperty(theme)) {
        let pTheme = defaultPalette[theme];
        this.colorList[theme] = [];
        
        pTheme.forEach((dp, idx) => {
          that.colorList[theme].push({
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
    }
    
  }

  // addCustomColor = (item) => {
  //   let lastId = this.colorList[this.colorList.length - 1].id
  //   this.colorList.push({
  //     id: lastId + 1,
  //     color: item.color,
  //     hex: item.hex,
  //     rgb: item.rgb,
  //     rgbStr: CoreFunc.formatRgb(item.rgb),
  //     list: [],
  //   })
  // }

  // removeColor = (id) => {
  //   this.colorList = this.colorList.filter((color) => {
  //     return color.id !== id;
  //   })
  // }

  listAllColors = () => {
    return this.colorList;
  }

  getColorFromId = (key, themeId) => {
    if (key === -1) return { rgb: nonInstanceColor.rgb, alpha: nonInstanceColor.alpha };

    let current = Math.abs(key) % this.colorList[themeId].length;
    let color   = this.colorList[themeId][current];

    if (color && color.list.includes(key)) {
      let currentPos = color.list.indexOf(key);
      let newColor = [ ...color.rgb ];

      for (let i = 0; i < currentPos; i++) {
        let minIndex = CoreFunc.getMinValueIndexFromArray(newColor).index;
        newColor = newColor.map((el, idx) => {
          if (idx === minIndex) return (el + 30) % 256;
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

export default ColorSelector;