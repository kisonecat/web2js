'use strict';

module.exports = class FunctionEvaluation {
  constructor(f,xs) {
    this.f = f;
    this.xs = xs;
  }

  generate(environment) {
    var m = environment.module;

    if (this.f.name.toLowerCase() == "trunc") {
      return m.i32.trunc_s.f64(this.xs[0].generate(environment));
    }

    if (this.f.name.toLowerCase() == "round") {
      // nearest is actually "roundeven" which is what round is in pascal
      return m.i32.trunc_s.f64(m.f64.nearest(this.xs[0].generate(environment)))
    }    
    
    return m.nop();
    
    //return `${this.f.generate(block)}(${this.xs.map( function(p) { return p.generate(block); } ).join(',')})`;
  }
};
