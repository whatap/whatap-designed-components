'use strict';
const singleton = Symbol('singleton');

export default class Singleton {
  static get instance() {
    if (!this[singleton]) {
      this[singleton] = new this;
    }

    return this[singleton];
  }

  constructor() {
    let Class = new.target;

    if (!Class[singleton]) {
      Class[singleton] = this;
    }
    
    return Class[singleton];
  }
}