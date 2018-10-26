'use strict';

module.exports = class FunctionEvaluation {
  constructor(f,xs) {
    this.f = f;
    this.xs = xs;
  }

  toString() {
    return `${this.f}(${this.xs.map( function(p) {p.toString();} ).join(',')})`;
  }
};
