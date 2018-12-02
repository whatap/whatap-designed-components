const style = 'border: none; display: block; float: left; width: 6px; height: 6x; margin-right: 5px; margin-top: 0px;';

export function createStyle(mx, my, options) {
  let innerStyle = {
    'position': 'absolute',
    'float': 'left',
    'left': `${mx + 15}px`,
    'top': `${my + 10}px`,
    'z-index': 10000,
    'background-color': '#000000',
    'border-radius': '6px',
    'padding': '3px',
    'color': '#ffffff',
    'font-size': '12px',
  }
  for (let opt in options) {
    if (options.hasOwnProperty(opt)) {
      innerStyle[opt] = options[opt];
    }
  }
  
  let output = '';
  for (let key in innerStyle) {
    if (innerStyle.hasOwnProperty(key)) {
      output += `${key}:${innerStyle[key]};`
    }
  }
  return output;
}

export function drawTooltipCircle(color, style=style) {
  var circle = '<span style="' + style + '"><svg height="8" width="8">'
  circle += '<circle cx="4" cy="4" r="4" fill="' + color + '" />'
  circle += '</svg></span>'
  return circle
}

class Tooltip {
  constructor() {
    this.tooltipEl = document.createElement('div');
    this.tooltipEl.className = 'tooltip';
    this.tooltipEl.style.position = 'absolute';

    this.tooltipOn = false;
  }

  follow = (evt, textContent) => {
    this.tooltipEl.innerHTML = textContent;

    let moveX = evt.clientX;
    let moveY = evt.clientY;

    this.leftPos += moveX - this.evtX;
    this.topPos += moveY - this.evtY;

    this.tooltipEl.style.left = this.leftPos + "px";
    this.tooltipEl.style.top = this.topPos + "px";

    this.evtX = moveX;
    this.evtY = moveY;
  }

  remove = (evt) => {
    this.tooltipOn = false;
    if (document.body.contains(this.tooltipEl)) {
      document.body.removeChild(this.tooltipEl);
    }
  }

  append = (evt, textContent) => {
    this.tooltipEl.innerHTML = textContent;

    document.body.appendChild(this.tooltipEl);

    let scrollX = document.documentElement.scrollLeft || document.body.scrollLeft;
    let scrollY = document.documentElement.scrollTop || document.body.scrollTop;
    let width = this.tooltipEl.offsetWidth;
    let height = this.tooltipEl.offsetHeight;
    this.evtX = evt.clientX;
    this.evtY = evt.clientY;
    this.leftPos = document.body.offsetWidth - this.evtX - scrollX > width ? this.evtX + scrollX + 10 : document.body.offsetWidth - width + 16;
    this.topPos = this.evtY - height > 6 ? this.evtY + scrollY - height + 40 : this.evtY + scrollY + 120;

    this.tooltipEl.style.cssText = createStyle(this.leftPos, this.topPos);
  }
}

export default Tooltip