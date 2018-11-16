
export const TYPE = {
  KEYS: 0,
  VALUES: 1,
  ENTRIES: 2
}

class Enumer {
  constructor(map, type) {
    this.map = map;
    this.entry = map.header.link_next;
    this.lastEnt = null;
    this.type = type;
  }

  hasMoreElements = () => {
    return this.map.header !== this.entry && this.entry !== null;
  }

  nextElement = () => {
    if (this.hasMoreElements()) {
      let e = this.lastEnt = this.entry;
      this.entry = e.link_next;
      switch(this.type) {
        case TYPE.KEYS:
          return e.key;
        case TYPE.VALUES:
          return e.value;
        default:
          return e;
      }
    }
    throw new Error("No more next value");
  }
}

export default Enumer;