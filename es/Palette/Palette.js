"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _PaletteColor = _interopRequireDefault(require("./PaletteColor"));

var _defaults = require("./defaults");

var _core = require("../core");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var Palette =
/*#__PURE__*/
function () {
  function Palette(id, addColor) {
    var _this = this;

    _classCallCheck(this, Palette);

    _defineProperty(this, "initList", function () {
      var that = _this;

      _this.paletteSet.map(function (color) {
        that.list.push(new _PaletteColor.default(0, color.rgb));
      });
    });

    this.id = id;
    this.list = [];

    if (addColor) {
      this.paletteSet = _toConsumableArray(_defaults.defaultPalette).concat(_toConsumableArray(addColor));
    } else {
      this.paletteSet = _defaults.defaultPalette;
    }

    this.initList();
  }
  /**
   * Change Default Palette to RGB
   */


  _createClass(Palette, [{
    key: "getColorFromPalette",
    value: function getColorFromPalette(value) {
      var toString = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
      var listLength = this.list.length;
      var key = Math.abs(value);
      var paletteColor = this.list[key % listLength];
      var currentColor = paletteColor;

      while (currentColor.getNextColor()) {
        currentColor = currentColor.getNextColor();
      }

      if (!paletteColor.hasChild) {
        paletteColor.hasChild = true;

        if (toString) {
          return _core.CoreFunc.formatRgb(paletteColor.rgb);
        } else {
          return paletteColor.rgb;
        }
      }

      currentColor.setNextColor();

      if (toString) {
        var rgb = currentColor.getNextColor().rgb;
        return _core.CoreFunc.formatRgb(rgb);
      } else {
        return currentColor.getNextColor();
      }
    }
  }]);

  return Palette;
}();

exports.default = Palette;