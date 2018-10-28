'use strict';

module.exports = class ArrayIndex {
  constructor(index) {
    this.index = index;
  }

  generate(block) {
    if (Array.isArray(this.index)) {
      return "???";
    } else {
      console.log("this.index=",this.index);
      return this.index.generate(block);
    }
  }
};
