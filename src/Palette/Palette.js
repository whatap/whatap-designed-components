import PaletteColor from "./PaletteColor";
import { defaultPalette } from './defaults';
import { CoreFunc } from '../core';

export default class Palette {
  constructor(id, addColor) {
    this.id = id;
    this.list = [];
    
    if (addColor) {
      this.paletteSet = [ ...defaultPalette, ...addColor ]
    } else {
      this.paletteSet = defaultPalette;
    }
    this.initList();
  }

  /**
   * Change Default Palette to RGB
   */
  initList = () => {
    let that = this;
    this.paletteSet.map((color) => {
      that.list.push(new PaletteColor(0, color.rgb));
    })
  }

  getColorFromPalette(value, toString = true) {
    const listLength = this.list.length;
    const key = Math.abs(value);
    let paletteColor = this.list[key % listLength];
    let currentColor = paletteColor;

    while (currentColor.getNextColor()) {
      currentColor = currentColor.getNextColor();
    }
    if (!paletteColor.hasChild) {
      paletteColor.hasChild = true;
      if (toString) {
        return CoreFunc.formatRgb(paletteColor.rgb);
      } else {
        return paletteColor.rgb;
      }
    }
    currentColor.setNextColor();

    if (toString) {
      let rgb = currentColor.getNextColor().rgb;
      return CoreFunc.formatRgb(rgb);
    } else {
      return currentColor.getNextColor();
    }
  }

}
