'use strict';

module.exports = class Type {
  constructor(name) {
    this.name = name;
  }

  toString() {
    return this.name;
  }
};
