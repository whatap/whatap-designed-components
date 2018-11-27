/**
 * WhaTap LinkedMap Library
 * created by Paul SJ. Kim
 * es6 port by Anthony MG. Lee
 */
import Enumer, { TYPE } from './Enumer';
import LinkedEntry from './LinkedEntry';

const DEFAULT_CAPACITY = 101;
const DEFAULT_LOAD_FACTOR = 0.75;
const MODE = {
  FORCE_FIRST: 0,
  FORCE_LAST: 1,
  FIRST: 2,
  LAST: 3
};

class LinkedMap {
  constructor(initCapacity, loadFactor) {
    this.initCapacity = initCapacity || DEFAULT_CAPACITY;
    this.loadFactor = loadFactor || DEFAULT_LOAD_FACTOR;
    this.threshold = parseInt(this.initCapacity * this.loadFactor);

    this.table = new Array(this.initCapacity);
    this.header = this.createLinkedEntry(null, null, null);
    this.header.link_next = this.header.link_prev = this.header;
    this.count = 0;
    this.max = 0;
  }

  hash = (key) => {
    return Math.abs(key);
  }
  keyType = (t) => {
    if (t === 'string') {
      this.hash = (str) => {
        let hash = 0;
        if (str === null || str.length === 0) return hash;
        for (let i = 0; i < str.length; i++) {
          let char = str.charAtCode(i);
          hash = ((hash << 5) - hash) + char;
          hash = hash & hash; 
        }
        return Math.abs(hash);
      }
    } else {
      this.hash = (key) => {
        return Math.abs(key);
      }
    }
    return this;
  }
  keys = () => new Enumer(this, TYPE.KEYS);
  values = () => new Enumer(this, TYPE.VALUES);
  entries = () => new Enumer(this, TYPE.ENTRIES);

  isEmpty = () => this.size() === 0;
  isFull = () => this.max > 0 && this.max <= this.count;

  put = (key, value) => this._put(key, value, MODE.LAST);
  putLast = (key, value) => this._put(key, value, MODE.FORCE_LAST);
  putFirst = (key, value) => this._put(key, value, MODE.FORCE_FIRST);
  putAll = (other) => {
    if (other === null) {
      return null;
    }
    let it = other.entries();
    while (it.hasMoreElements()) {
      let e = it.nextElement();
      this.put(e.getKey(), e.getValue());
    }
  }
  _put = (key, value, m, noover) => {
    if (noover && this.max > 0 && this.size() > this.max) {
      return null;
    }
    let tab = this.table;
    let index = this.hash(key) % tab.length;
    for (let e = tab[index]; e !== null && typeof e !== 'undefined'; e = e.next) {
      if ( e.key === key ) {
        let old = e.value;
        e.value = value;
        switch(m) {
          case MODE.FORCE_FIRST:
            if (this.header.link_next !== e) {
              this.unchain(e);
              this.chain(this.header, this.header.link_next, e);
            }
            break;
          case MODE.FORCE_LAST:
            if (this.header.link_prev !== e) {
              this.unchain(e);
              this.chain(this.header.link_prev, this.header, e);
            }
            break;
        }
        return old;
      }
    }

    if (this.max > 0) {
      switch (m) {
        case MODE.FORCE_FIRST:
        case MODE.FIRST:
          while (this.count >= this.max) {
            let k = this.header.link_prev.key;
            let v = this.remove(k);
            this.overflowed(k, v);
          }
          break;
        case MODE.FORCE_LAST:
        case MODE.LAST:
          while (this.count >= this.max) {
            let k = this.header.link_next.key;
            let v = this.remove(k);
            this.overflowed(k, v);
          }
          break;
      }
    }

    if (this.count >= this.threshold) {
      this.rehash();
      tab = this.table;
      index = this.hash(key) % tab.length;
    }
    
    let e = this.createLinkedEntry(key, value, tab[index]);
    tab[index] = e;

    switch(m) {
      case MODE.FORCE_FIRST:
      case MODE.FIRST:
        this.chain(this.header, this.header.link_next, e);
        break;
      case MODE.FORCE_LAST:
      case MODE.LAST:
        this.chain(this.header.link_prev, this.header, e);
        break;
    } 

    this.count++;
    return null;
  }

  overflowed = (key, value) => {

  }

  chain = (link_prev, link_next, e) => {
    e.link_prev = link_prev;
    e.link_next = link_next;
    link_prev.link_next = e;
    link_next.link_prev = e;
  }
  unchain = (e) => {
    e.link_prev.link_next = e.link_next;
    e.link_next.link_prev = e.link_prev;
    e.link_prev = null;
    e.link_next = null;
  }

  intern = (key) => {
    if (!key) return;
    return this._intern(key.toString(), MODE.LAST);
  }
  _intern = (key, m) => {
    if (!key) return;
    let tab = this.table;
    let index = this.hash(key) % tab.length;

    for (let e = tab[index]; e !== null && typeof e !== 'undefined'; e = e.next) {
      if (e.key === key) {
        let old = e.value;
        switch (m) {
          case MODE.FORCE_FIRST:
            if (this.header.link_next !== e) {
              this.unchain(e);
              this.chain(this.header, this.header.link_next, e);
            }
            break;
          case MODE.FORCE_LAST:
            if (this.header.link_prev !== e) {
              this.unchain(e);
              this.chain(this.header.link_prev, this.header, e);
            }
            break;
        }
        return old;
      }
    }

    let value = this.create(key);
    if (value === null) {
      return null;
    }
    if (this.max > 0) {
      switch (m) {
        case MODE.FORCE_FIRST:
        case MODE.FIRST:
          while (this.count >= this.max) {
            let k = this.header.link_prev.key;
            let v = this.remove(k);
            this.overflowed(k, v);
          }
          break;
        case MODE.FORCE_LAST:
        case MODE.LAST:
          while (this.count >= this.max) {
            let k = this.header.link_next.key;
            let v = this.remove(k);
            this.overflowed(k, v);
          }
          break;
      }
    }
    if (this.count >= this.threshold) {
      this.rehash();
      tab = this.table;
      index = this.hash(key) % tab.length;
    }

    let e = this.createLinkedEntry(key, value, tab[index]);
    tab[index] = e;
    switch (m) {
      case MODE.FORCE_FIRST:
      case MODE.FIRST:
        this.chain(this.header, this.header.link_next, e);
        break;
      case MODE.FORCE_LAST:
      case MODE.LAST:
        this.chain(this.header.link_prev, this.header, e);
        break;
    }
    this.count++;
    return value;
  }

  remove = (key) => {
    if (key === null) {
      return null;
    }
    let tab = this.table;
    let index = this.hash(key) % tab.length;
    for (let e = tab[index], prev = null; e !== null && typeof e !== 'undefined'; prev = e, e= e.next) {
      if (e.key === key) {
        if (prev !== null) {
          prev.next = e.next;
        } else {
          tab[index] = e.next;
        }
        this.count--;
        let oldValue = e.value;
        e.value = null;
        this.unchain(e);
        return oldValue;
      }
    }
    return null;
  }
  removeFirst = () => {
    if (this.isEmpty()) {
      return null;
    }
    return this.remove(this.header.link_next.key);
  }
  removeLast = () => {
    if (this.isEmpty()) {
      return null;
    }
    return this.remove(this.header.link_prev.key);
  }

  clear = () => {
    this.table = this.table.map((tb) => {
      return null;
    })
    this.header.link_next = this.header.link_prev = this.header;
    this.count = 0;
  }

  sort = (f) => {
    if (this.size() <= 1) {
      return this;
    }
    let ent = [];
    let it = this.entries();
    for (let i = 0; it.hasMoreElements(); i++) {
      ent[i] = it.nextElement();
    }
    this.clear();

    ent.sort(f);
    let len = ent.length;
    for (let i = 0; i < len; i++) {
      this.put(ent[i].key, ent[i].value);
    }
  }

  setMax = (max) => {
    this.max = max;
    return this;
  }

  containsKey = (key) => {
    if (key === null) {
      return false;
    }
    let tab = this.table;
    let index = this.hash(key) % tab.length;
    for (let e = tab[index]; e !== null && typeof e !== 'undefined'; e = e.next) {
      if (e.key === key) {
        return true;
      }
    }
    return false;
  }
  get = (key) => {
    if (key === null) {
      return null;
    }

    let tab = this.table;
    let index = this.hash(key) % tab.length;

    for (let e = tab[index]; e !== null && typeof e !== 'undefined'; e = e.next) {
      if (e.key === key) {
        return e.value;
      }
    }
    return null;
  }
  getFirstKey = () => {
    if (this.isEmpty()) {
      return null;
    }
    return this.header.link_next.key;
  }
  getLastKey = () => {
    if (this.isEmpty()) {
      return null;
    }
    return this.header.link_prev.key;
  }
  getLastValue = () => {
    if (this.isEmpty()) {
      return null;
    }
    return this.header.link_prev.value;
  }
  rehash = () => {

  }


  /**
   * @public
   * @description
   * `enumer` returns an enumer object.
   * enumer provides a way to move around the list.
   * 
   */
  getEnumer = (map, type) => {
    return new Enumer(map, type);
  }

  createLinkedEntry = (key, value, next) => {
    return new LinkedEntry(key, value, next);
  }

  toString = () => {
    let str = '';
    let it = this.entries();
    str += '{';
    for (let i = 0; it.hasMoreElements(); i++) {
      let e = it.nextElement();
      if (i > 0) {
        str += ", ";
      }
      str += `${e.getKey()}=${e.getValue()}`;
    }
    str += '}';
    return str;
  }

}

export default LinkedMap;