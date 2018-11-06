import { CoreFunc } from '../core'

export default class PaletteColor {
  constructor(id, rgb, oid, nextColor) {
    this.id = id;
    this.oid = oid || 0;
    this.rgb = rgb || [0, 0, 0];
    this.nextColor = nextColor || undefined;
    this.rootHasChild = false;
    this.numOfChildren = 0;
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
      if (idx === minIndex) return (el + 10) % 256;
      else return el;
    })
    let nextColor = new PaletteColor(this.id + 1, newColor, oid);
    this.nextColor = nextColor;
  }

  getNextColor = () => {
    return this.nextColor;
  }
}