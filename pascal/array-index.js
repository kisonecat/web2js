'use strict';

module.exports = class ArrayIndex {
  constructor(index) {
    this.index = index;
  }

  generate(block) {
    if (Array.isArray(this.index)) {
      return "???";
    } else {
      return this.index.generate(block);
    }
  }
};
