'use strict';

module.exports = class ArrayType {
  constructor(index, componentType) {
    this.index = index;
    this.componentType = componentType;
  }

  toString() {
    return `array indexed by ${this.index} of ${this.componentType}`;
  }
};
