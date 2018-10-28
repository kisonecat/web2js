'use strict';

module.exports = class FunctionEvaluation {
  constructor(f,xs) {
    this.f = f;
    this.xs = xs;
  }

  generate(block) {
    return `${this.f}(${this.xs.map( function(p) { if (p.generate) return p.generate(block); else return p.toString();} ).join(',')})`;
  }
};
