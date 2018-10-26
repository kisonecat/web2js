'use strict';

module.exports = class ArrayIndex {
  constructor(index) {
    this.index = index;
  }

  toString() {
    return this.index.toString();
  }
};
