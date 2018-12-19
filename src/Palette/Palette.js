import PaletteColor from "./PaletteColor";
import { defaultPalette, nonInstanceColor } from './defaults';
import { CoreFunc, LSHandler } from '../core';

/**
 * Palette stores the color information for usages within components.
 * You can save / load palette info within your local storage based on the id.
 */
export default class Palette {
  /**
   * @param {Integer} id: Identifier for each palette
   * @param {Boolean} load: Defaults to `true`, if set to false, palette will not retrieve data from local storage
   * @param {Array} addColor: Additional colors to add to the palette
   */
  constructor(id, load = true, save = true, addColor) {
    this.id = id;
    this.list = [];
    this.cache = [];
    this.save = save;

    if (load) {
      this.loadSavedList();
    } 

    if (this.list.length === 0) {
      if (addColor) {
        this.paletteSet = [ ...defaultPalette, ...addColor ];
      } else {
        this.paletteSet = [ ...defaultPalette ];
      }
      this.initList();
    }
  }

  /**
   * @private
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
   * @param {Number} value: Value to be found.
   * @param {Boolean} toString: Check false to return the value in array form. [r, g, b]
   */
  getColorFromId = (value, toString = true) => {
    const cacheLength = this.cache.length;
    const listLength = this.list.length;


    if (value === -1) {
      return this.returnColor(nonInstanceColor.rgb, toString);
    }

    /**
     * Search through the List to find if the oid has already been assigned.
     * If so, return that color and return 
     */

    for (let i = 0; i < cacheLength; i++) {
      let cachedColor = this.cache[i];
      if (cachedColor.oid === value) {
        return this.returnColor(cachedColor.rgb, toString);
      }
    }

    for (let i = 0; i < listLength; i++) {
      let pColor = this.list[i]; 
      let currentColor = pColor;

      while (currentColor) {
        if (currentColor.oid === value) {
          if (!this.cache.includes(currentColor)) {
            this.cache.push(currentColor);
          }
          return this.returnColor(currentColor.rgb, toString);
        }
        currentColor = currentColor.getNextColor();
      }
    }

    /**
     * Colors will loop through the base palette array
     * Return the color which is not taken.
     * If all elements within the array is taken,
     * It will find the color node with the lowest number of children.
     */
    let minChildIdx = 0;
    for(let j = 0; j < listLength; j++) {
      let pColor = this.list[j];

      if (!pColor.rootHasChild) {
        pColor.rootHasChild = true;
        pColor.numOfChildren += 1;
        pColor.oid = value;
        this.savePalette();
        return this.returnColor(pColor.rgb, toString);
      }
      if (pColor.numOfChildren < this.list[minChildIdx].numOfChildren) {
        minChildIdx = j;
      }
    }

    /**
     * After getting the color node with the lowest number of children,
     * It will loop within the node, returning the last heir.
     */
    let minPaletteColor = this.list[minChildIdx];
    let currentColor = minPaletteColor;
    minPaletteColor.numOfChildren += 1;

    while (currentColor.getNextColor()) {
      currentColor = currentColor.getNextColor();
    }

    currentColor.setNextColor(value);
    this.savePalette();
    return this.returnColor(currentColor.getNextColor().rgb, toString);
  }

  /**
   * Get Oid value from rgb string.
   * returns 0 if no valid value is found.
   * @param {Array | String} rgb 
   */
  getIdFromColor = (rgb) => {
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

  savePalette = () => {
    if (this.save) {
      let currentList = JSON.stringify(this.list);
      LSHandler.saveToStorage(`palette_${this.id}`, currentList);
    }
  }

  /**
   * Load saved list from localStorage.
   * Object assignment must be done again as the local storage only saves it in json form, thus removing the instance property.
   */
  loadSavedList = () => {
    try {
      const that = this;
      let savedList = JSON.parse(LSHandler.loadFromStorage(`palette_${this.id}`));
      savedList && savedList.map((color) => {
        that.list.push(new PaletteColor(color.id, color.rgb, color.oid, color.nextColor));
      })
      this.list.map((item) => {
        let inner = item;
        while (inner) {
          if (inner.getNextColor()) {
            inner.nextColor = new PaletteColor(inner.nextColor.id, 
                                               inner.nextColor.rgb, 
                                               inner.nextColor.oid, 
                                               inner.nextColor.nextColor);
          }
          inner = inner.getNextColor();
        }
      })
    } catch (e) {
      console.error("JSON parse error. Cannot load data from localStorage");
    }
  }

  /**
   * Format and return RGB value.
   * Return string if `toString` is set to true. Otherwise, return an array.
   * @param {Array} rgb
   * @param {Boolean} toString 
   */
  returnColor = (rgb, toString) => {
    if (toString) {
      return CoreFunc.formatRgb(rgb);
    } else {
      return rgb;
    }
  }

  /**
   * NOT IMPLEMENTED YET
   */
  removePalette = () => {
    LSHandler.removeFromStorage(`palette_${this.id}`);
  }

}
