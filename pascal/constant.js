'use strict';

module.exports = class Constant {
  constructor(name) {
    this.name = name;
  }

  generate() {
    return this.name;
  }
}
