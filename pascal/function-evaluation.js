'use strict';
var Binaryen = require('binaryen');

module.exports = class FunctionEvaluation {
  constructor(f,xs) {
    this.f = f;
    this.xs = xs;
  }

  generate(environment) {
    var module = environment.module;

    if (this.f.name.toLowerCase() == "trunc") {
      return module.i32.trunc_s.f64(this.xs[0].generate(environment));
    }

    if (this.f.name.toLowerCase() == "round") {
      // nearest is actually "roundeven" which is what round is in pascal
      return module.i32.trunc_s.f64(module.f64.nearest(this.xs[0].generate(environment)))
    }    

    var compiledParams = this.xs.map( function(p) { return p.generate(environment); } );

    if (environment.resolveFunction( this.f ) === undefined) {
      throw `Function ${this.f.name} is not defined.`;
    }

    var result = environment.resolveFunction( this.f ).resultType.binaryen();
    
    return module.call( this.f.name, compiledParams, result );
  }
};
