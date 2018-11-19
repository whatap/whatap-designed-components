
export default class WChart {
  constructor() {
    this.bc_rect = null;
    this.ratio = null;
  }

  wSetBoundingClientRect = (element) => {
    if ( this.bc_rect === null ) {
      this.bc_rect = element.getBoundingClientRect();
    }
  }

  wSetScreenRatio = () => {
    if ( this.ratio === null) {
      this.ratio = window.devicePixelRatio;
    }
    if (this.ratio < 2) {
      this.ratio = 2;
    }
  }

  clearClientRect = () => {
    this.bc_rect = null;
  }

  clearScreenRatio = () => {
    this.ratio = null;
  }
}