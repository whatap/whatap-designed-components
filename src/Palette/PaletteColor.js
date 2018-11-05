import { CoreFunc } from '../core'

export default class PaletteColor {
  constructor(id, rgb, oid) {
    this.id = id;
    this.oid = oid || 0;
    this.rgb = rgb || [0, 0, 0];
    this.nextColor = undefined;
    this.hasChild = false;
  }

  setThisColor = (rgb) => {
    this.rgb = rgb; 
  }

  static printRgb = (rgb) => {
    return `rgb(${rgb[0]},${rgb[1]},${rgb[2]})`
  }

  static printRgbWithAlpha = (alpha) => {
    if (typeof alpha !== 'number') return;
    return `rgba(${this.rgb[0]},${this.rgb[1]},${this.rgb[2]},${alpha})`
  }

  setNextColor = (oid) => {
    let minIndex = CoreFunc.getMinValueIndexFromArray(this.rgb).index;
    let newColor = this.rgb.map((el, idx) => {
      if (idx === minIndex) return (el + 30) % 256;
      else return el;
    })
    let nextColor = new PaletteColor(this.id + 1, newColor, oid);
    this.nextColor = nextColor;
  }

  getNextColor = () => {
    if (this.nextColor) {
      return this.nextColor;
    }
  }
}