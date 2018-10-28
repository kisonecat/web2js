'use strict';

module.exports = class NumericLiteral {
  constructor(n) {
    this.number = n;
  }

  generate() {
    return this.number.toString();
  }
};
