"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _core = require("../core");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var PaletteColor = function PaletteColor(id, _rgb) {
  var _this = this;

  _classCallCheck(this, PaletteColor);

  _defineProperty(this, "setThisColor", function (rgb) {
    _this.rgb = rgb;
  });

  _defineProperty(this, "printRgb", function () {
    return "rgb(".concat(_this.rgb[0], ",").concat(_this.rgb[1], ",").concat(_this.rgb[2], ")");
  });

  _defineProperty(this, "printRgbWithAlpha", function (alpha) {
    if (typeof alpha !== 'number') return;
    return "rgba(".concat(_this.rgb[0], ",").concat(_this.rgb[1], ",").concat(_this.rgb[2], ",").concat(alpha, ")");
  });

  _defineProperty(this, "setNextColor", function () {
    var minIndex = _core.CoreFunc.getMinValueIndexFromArray(_this.rgb).index;

    var newColor = _this.rgb.map(function (el, idx) {
      if (idx === minIndex) return (el + 30) % 256;else return el;
    });

    var nextColor = new PaletteColor(_this.id + 1, newColor);
    _this.nextColor = nextColor;
  });

  _defineProperty(this, "getNextColor", function () {
    if (_this.nextColor) {
      return _this.nextColor;
    }
  });

  this.id = id;
  this.rgb = _rgb || [0, 0, 0];
  this.nextColor = undefined;
  this.hasChild = false;
};

exports.default = PaletteColor;