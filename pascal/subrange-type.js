'use strict';

module.exports = class SubrangeType {
  constructor(lower,upper) {
    this.lower = lower;
    this.upper = upper;
  }

  generate(e) {
    return `range ${this.lower.generate(e)}..${this.upper.generate(e)}`;
  }
}
