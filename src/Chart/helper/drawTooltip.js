const style = 'border: none; display: block; float: left; width: 6px; height: 6x; margin-right: 5px; margin-top: 0px;';

export function createStyle(mx, my) {
  const innerStyle = {
    'position': 'absolute',
    'float': 'left',
    'left': `${mx + 15}px`,
    'top': `${my}px`,
    'z-index': 10000,
    'visibility': 'visible',
    'background-color': '#000000',
    'border-radius': '6px',
    'padding': '3px',
    'color': '#ffffff',
    'font-size': '12px',
  }

  let output = '';
  for (let key in innerStyle) {
    if (innerStyle.hasOwnProperty(key)) {
      output += `${key}:${innerStyle[key]};`
    }
  }
  return output;
}

export function styleHidden() {
  return "visibility:hidden;";
}

export function drawTooltipCircle(color, style=style) {
  var circle = '<span style="' + style + '"><svg height="8" width="8">'
  circle += '<circle cx="4" cy="4" r="4" fill="' + color + '" />'
  circle += '</svg></span>'
  return circle
}
