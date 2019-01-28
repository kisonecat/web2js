'use strict';

module.exports = class ArrayType {
  constructor(index, componentType) {
    this.index = index;
    this.componentType = componentType;
  }

  initializer(e) {
    if (this.componentType.intish) {
      var intish = this.componentType.intish();
      return `new ${intish}Array(${this.index.range(e)})`;
    }

    return "{}";
  }
  
  generate(e) {
    return `array indexed by ${this.index.generate(e)} of ${this.componentType.generate(e)}`;
  }
};
