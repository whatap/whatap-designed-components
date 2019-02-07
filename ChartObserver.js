"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ChartObserver = function ChartObserver() {
  var _this = this;

  _classCallCheck(this, ChartObserver);

  this.subscribe = function (eventName, handler, context) {
    var eventNamespace = _this.handlers[eventName];

    if (eventNamespace === undefined) {
      eventNamespace = _this.handlers[eventName] = [];
    }

    eventNamespace.push({
      handler: handler,
      context: context
    });
  };

  this.unsubscribe = function (eventName, handler, context) {
    var eventNamespace = _this.handlers[eventName];
    if (eventNamespace === undefined) return;
    var length = eventNamespace.length;

    for (var idx = 0; idx < length; idx++) {
      var cHandler = eventNamespace[idx];

      if (handler === cHandler['handler'] && context === cHandler['context']) {
        eventNamespace.splice(idx, 1);
        return;
      }
    }
  };

  this.unsubscribeAll = function () {
    _this.handlers = {};
  };

  this.notify = function (eventName, data) {
    var eventNamespace = _this.handlers[eventName];
    if (eventNamespace === undefined) return;
    var length = eventNamespace.length;

    for (var idx = 0; idx < length; idx++) {
      var cHandler = eventNamespace[idx];
      cHandler['handler'].call(cHandler['context'], data);
    }
  };

  if (instance) return instance;
  instance = this;
  this.handlers = {};
}; // const instance = new ChartObserver();
// Object.freeze(instance);


ChartObserver.instance = void 0;
var _default = ChartObserver;
exports.default = _default;