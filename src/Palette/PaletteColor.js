import { CoreFunc } from '../core'

export default class PaletteColor {
  constructor(id, rgb) {
    this.id = id;
    this.rgb = rgb || [0, 0, 0];
    this.nextColor = undefined;
    this.hasChild = false;
  }

  setThisColor = (rgb) => {
    this.rgb = rgb; 
  }

  printRgb = () => {
    return `rgb(${this.rgb[0]},${this.rgb[1]},${this.rgb[2]})`
  }

  printRgbWithAlpha = (alpha) => {
    if (typeof alpha !== 'number') return;
    return `rgba(${this.rgb[0]},${this.rgb[1]},${this.rgb[2]},${alpha})`
  }

  setNextColor = () => {
    let minIndex = CoreFunc.getMinValueIndexFromArray(this.rgb).index;
    let newColor = this.rgb.map((el, idx) => {
      if (idx === minIndex) return (el + 30) % 256;
      else return el;
    })
    let nextColor = new PaletteColor(this.id + 1, newColor);
    this.nextColor = nextColor;
  }

  getNextColor = () => {
    if (this.nextColor) {
      return this.nextColor;
    }
  }
}