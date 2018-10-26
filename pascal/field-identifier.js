'use strict';

module.exports = class FieldIdentifier {
  constructor(name) {
    this.name = name;
  }

  toString() {
    return this.name;
  }
};
