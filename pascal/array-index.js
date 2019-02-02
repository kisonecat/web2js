'use strict';

module.exports = class ArrayIndex {
  constructor(index) {
    this.index = index;
  }

  generate(block) {
    return this.index.generate(block);
  }
};
