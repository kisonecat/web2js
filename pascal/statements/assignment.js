'use strict';

module.exports = class Assignment {
  constructor(lhs,rhs) {
    this.lhs = lhs;
    this.rhs = rhs;
  }

  toString() {
    return `${this.lhs} = ${this.rhs};`;
  }
};
