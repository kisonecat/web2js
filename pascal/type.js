'use strict';

module.exports = class Type {
  constructor(name) {
    this.name = name;
  }

  generate(e) {
    return this.name;
  }
};
