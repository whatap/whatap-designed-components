"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.HashString = HashString;
exports.default = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var palette = {
  blue: '#329af0',
  royalBlue: '#1565c0',
  darkBlue: '#1a237e',
  yellow: '#f2de22',
  orange: '#ff9d33',
  red: '#ff5f5f',
  purple: '#845ef7',
  teal: '#00b7d0',
  seaGreen: '#0ee5b1',
  periwinkle: '#748ffc',
  lightBlue: '#72c3fc',
  gray: '#b5bdc4',
  mustard: '#f3c339',
  green: '#06c606',
  lightPurple: '#bc83ff',
  pink: '#ff95fb',
  paleGreen: '#a1e5ac',
  errorBlack: '#000000'
};

function HashString(str) {
  var hash = 0;
  if (typeof str === 'undefined' || str.length === 0) return hash;

  for (var i = 0; i < str.length; i++) {
    var char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }

  return Math.abs(hash);
}

var ColorPicker =
/*#__PURE__*/
function () {
  function ColorPicker() {
    _classCallCheck(this, ColorPicker);

    this.color = palette.errorBlack;
  }

  _createClass(ColorPicker, [{
    key: "fromInteger",
    value: function fromInteger(value) {
      var calVal = Math.abs(value);
      var rgb = [0, 0, 0];
      var pos = 0;

      while (calVal > 0) {
        rgb[pos % 3] += calVal % 1000;
        calVal /= 1000;
        pos += 1;
      }

      for (var i = 0; i < 3; i++) {
        rgb[i] = Number(rgb[i] % 256).toFixed(0);
      }

      var rgbVal = "rgba(".concat(rgb[0], ", ").concat(rgb[1], ", ").concat(rgb[2], ", 1)");
      return rgbVal;
    }
  }, {
    key: "fromString",
    value: function fromString(value, hash) {
      var hashedValue;

      if (hash) {
        hashedValue = value;
      } else {
        hashedValue = HashString(value);
      }

      return this.fromInteger(hashedValue);
    }
  }, {
    key: "fromPalette",
    value: function fromPalette(value) {
      if (palette[value]) {
        this.color = palette[value];
      } else {
        this.color = palette.errorBlack;
        console.log("Palette does not have the color ".concat(value));
      }

      return this.color;
    }
  }, {
    key: "getStoreColor",
    value: function getStoreColor() {
      return this.color;
    }
  }, {
    key: "setStoreColor",
    value: function setStoreColor(value) {
      if (typeof value !== 'string' && value.length === 0) return;

      if (value[0] === '#') {
        this.color = value;
      } else if (value.slice(0, 3) === 'rgb') {
        this.color = value;
      } else {
        this.color = fromString(value);
      }
    }
  }, {
    key: "printPalette",
    value: function printPalette() {
      for (color in palette) {
        if (palette.hasOwnProperty(color)) {
          console.log("".concat(color, ": ").concat(palette[color]));
        }
      }
    }
  }]);

  return ColorPicker;
}();

var _default = ColorPicker;
exports.default = _default;