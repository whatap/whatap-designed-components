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

  /**
   * Get Color value in rgb value from predefined palette
   * @param {integer} value: Value to be found.
   * @param {boolean} toString: Check false to return the value in array form. \
   */
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
      paletteColor.oid = value;
      if (toString) {
        return CoreFunc.formatRgb(paletteColor.rgb);
      } else {
        return paletteColor.rgb;
      }
    }
    currentColor.setNextColor(value);

    if (toString) {
      let rgb = currentColor.getNextColor().rgb;
      return CoreFunc.formatRgb(rgb);
    } else {
      return currentColor.getNextColor();
    }
  }

  /**
   * Get Oid value from rgb string.
   * returns 0 if no valid value is found.
   * @param {array | string} rgb 
   */
  getOidFromColor(rgb) {
    let rgbStr = rgb;
    if (Array.isArray(rgb) && rgb.length == 3) {
      rgbStr = PaletteColor.printRgb(rgb);
    }
    rgbStr = rgbStr.replace(" ", "");

    let oid = 0;

    for (let i = 0; i < this.list.length; i++) {
      let pointer = this.list[i];
      while (typeof pointer.nextColor !== 'undefined' 
      && PaletteColor.printRgb(pointer.rgb) !== rgbStr) {
        pointer = pointer.getNextColor();
      }
      if (PaletteColor.printRgb(pointer.rgb) === rgbStr) {
        oid = pointer.oid;
        break;
      }
    }
    return oid;
  }

}
