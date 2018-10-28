'use strict';

module.exports = class SubrangeType {
  constructor(lower,upper) {
    this.lower = lower;
    this.upper = upper;
  }

  toString() {
    return `range ${this.lower}..${this.upper}`;
  }
}
