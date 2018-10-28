'use strict';

module.exports = class FunctionEvaluation {
  constructor(f,xs) {
    this.f = f;
    this.xs = xs;
  }

  generate(block) {
    return `${this.f.generate(block)}(${this.xs.map( function(p) { return p.generate(block); } ).join(',')})`;
  }
};
