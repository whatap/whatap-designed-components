import Singleton from "../../core/Singleton";

class ChartObserver extends Singleton{
  constructor() {
    super();
    this.handlers = {};
  }

  subscribe = (eventName, handler, context) => {
    let eventNamespace = this.handlers[eventName];

    if (eventNamespace === undefined) {
      eventNamespace = this.handlers[eventName] = [];
    }
    eventNamespace.push({ handler: handler, context: context });
  }

  unsubscribe = (eventName, handler, context) => {
    let eventNamespace = this.handlers[eventName];

    if (eventNamespace === undefined) return;

    let length = eventNamespace.length;
    for (let idx = 0; idx < length; idx++) {
      let cHandler = eventNamespace[idx];
      if (handler === cHandler['handler']
      && context === cHandler['context']) {
        eventNamespace.splice(idx, 1);
        return;
      }
    }
  }

  unsubscribeAll = () => {
    this.handlers = {};
  }

  notify = (eventName, data) => {
    let eventNamespace = this.handlers[eventName];

    if (eventNamespace === undefined) return;

    let length = eventNamespace.length;
    for (let idx = 0; idx < length; idx++) {
      let cHandler = eventNamespace[idx];
      cHandler['handler'].call(cHandler['context'], data);
    }
  }
}

export default ChartObserver;