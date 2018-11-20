
export default class WChart {
  constructor() {
    this.bcRect = null;
    this.ratio = null;
  }

  wGetBoundingClientRect = (element) => {
    if ( this.bcRect === null ) {
      this.bcRect = element.getBoundingClientRect();
    }
		return this.bcRect;
  }

  wGetScreenRatio = () => {
    if ( this.ratio === null) {
      this.ratio = window.devicePixelRatio;
    }
    if (this.ratio < 2) {
      this.ratio = 2;
    }
  }

  clearClientRect = () => {
    this.bcRect = null;
  }

  clearScreenRatio = () => {
    this.ratio = null;
  }
}
