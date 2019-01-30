'use strict';

module.exports = class Conditional {
  constructor(expression, result, otherwise) {
    this.expression = expression;
    this.result = result;
    this.otherwise = otherwise;    
  }

  gotos() {
    var g = this.result.gotos();
    
    if (this.otherwise) {
      g = g.concat( this.otherwise.gotos() );
    }
    
    return g;
  }

  
  toString() {
    this.generate(undefined);
  }
  
  generate(environment) {
    var module = environment.module;

    if (this.otherwise) {
      return module.if( this.expression.generate(environment),
                        this.result.generate(environment),
                        this.otherwise.generate(environment) );
    } else {
      return module.if( this.expression.generate(environment),
                        this.result.generate(environment) );
    }
  }
};
