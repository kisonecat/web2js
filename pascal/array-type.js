'use strict';

module.exports = class ArrayType {
  constructor(index, componentType) {
    this.index = index;
    this.componentType = componentType;
  }

  generate(e) {
    return `array indexed by ${this.index.generate(e)} of ${this.componentType.generate(e)}`;
  }
};
