import { defaultPalette, nonInstanceColor } from '../meta/colorMeta';
import { CoreFunc } from '../../core';
import { Singleton } from '../../core'

class ColorSelector extends Singleton{
  constructor() {
    super();
    let that       = this;
    this.hash      = Math.random() * 1000;
    this.colorList = {};
    this.keyList = []; // { key: number, id: idx }
    
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
            count: 0
          })
        })
      }
    }    
  }

  listAllColors = () => {
    return this.colorList;
  }


  /**
   * @public
   * @description add theme to the color list
   * @params { key: string, theme: object }
   */
  addTheme = (key, theme) => {
    const self = this;
    if (!this.colorList[key]) {
      this.colorList[key] = [];

      theme.forEach((tp, idx) => {
        self.colorList[key].push({
          id: idx,
          color: tp.color,
          hex: tp.hex,
          rgb: tp.rgb,
          alpha: tp.alpha,
          rgbStr: CoreFunc.formatRgb(tp.rgb, tp.alpha),
          list: [],
          count: 0
        })
      })
    }
  }

  /**
   * @deprecated 2019.03.12
   */
  UNUSED_getColorFromId = (key, themeId) => {
    if (key === -1) return { rgb: nonInstanceColor.rgb, alpha: nonInstanceColor.alpha };

    let current = Math.abs(key) % this.colorList[themeId].length;
    let color   = this.colorList[themeId][current];

    if (color && color.list.includes(key)) {
      let currentPos = color.list.indexOf(key);
      let newColor = [ ...color.rgb ];

      for (let i = 0; i < currentPos; i++) {
        let minIndex = CoreFunc.getMinValueIndexFromArray(newColor).index;
        newColor = newColor.map((el, idx) => {
          if (idx === minIndex) return (el + 70) % 256;
          else return el;
        })
      }
      return { rgb: newColor, alpha: color.alpha };
    } else {
      color.list.push(key);
      return { rgb: color.rgb, alpha: color.alpha };
    }
  }

  getColorFromId = (key, themeId = "wh") => {
    if (key === -1) return { rgb: nonInstanceColor.rgb, alpha: nonInstanceColor.alpha };

    const existsKeyset = this.keyList.find((keySet) => {
      return keySet.key === key;
    })

    if (existsKeyset) {
      const color = this.colorList[themeId][existsKeyset.id];
      return { rgb: color.rgb, alpha: color.alpha };
    } else {
      let currentColor = this.colorList[themeId][0];
      const color = this.colorList[themeId].find((colorP) => {
        return colorP.count < currentColor.count;
      })
      if (color) currentColor = color;

      currentColor.count += 1;
      currentColor.list.push(key);
      this.keyList.push({ key: key, id: currentColor.id })

      return { rgb: currentColor.rgb, alpha: currentColor.alpha };
    }
    
  }
}

export default ColorSelector;



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