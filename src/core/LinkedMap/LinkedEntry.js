class LinkedEntry {
  constructor(key, value, next) {
    this.key = key;
    this.value = value;
    this.next = next;
    this.link_next = null;
    this.link_prev = null;
  }

  getKey = () => {
    return this.key;
  }
  getValue = () => {
    return this.value;
  }
  setValue = (value) => {
    let oldValue = this.value;
    this.value = value;
    return oldValue;
  }
  toString = () => {
    return this.key + "=" + this.value;
  }
}

export default LinkedEntry;