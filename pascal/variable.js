'use strict';

module.exports = class Variable {
  constructor(name) {
    this.name = name;
  }

  toString() {
    return this.name;
  }
};
