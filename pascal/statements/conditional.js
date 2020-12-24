'use strict';
var Binaryen = require('binaryen');

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
      var theThen = this.result.generate(environment);
      var theElse = this.otherwise.generate(environment);
      
      return module.if( this.expression.generate(environment),
                        theThen, theElse );
    } else {
      return module.if( this.expression.generate(environment),
                        this.result.generate(environment) );
    }
  }
};
