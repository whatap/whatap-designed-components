"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var HeapSort = function HeapSort() {
  var _this = this;

  _classCallCheck(this, HeapSort);

  _defineProperty(this, "sort", function (array, isClone) {
    if (!Array.isArray(array)) throw new Error("Must provide valid array");

    if (isClone) {
      array = _toConsumableArray(array);
    }

    var n = array.length;
    var start = parseInt(n / 2 - 1);

    for (var i = start; i >= 0; i--) {
      _this.heapify(array, n, i);
    }

    for (var j = n - 1; j >= 0; j--) {
      var temp = array[0];
      array[0] = array[j];
      array[j] = temp;

      _this.heapify(array, j, 0);
    }

    if (isClone) {
      return array;
    }
  });

  _defineProperty(this, "heapify", function (arr, n, i) {
    var largest = i;
    var left = 2 * i + 1;
    var right = 2 * i + 2;

    if (left < n && arr[left] > arr[largest]) {
      largest = left;
    }

    if (right < n && arr[right] > arr[largest]) {
      largest = right;
    }

    if (largest !== i) {
      var swap = arr[i];
      arr[i] = arr[largest];
      arr[largest] = swap;

      _this.heapify(arr, n, largest);
    }
  });
};

exports.default = HeapSort;