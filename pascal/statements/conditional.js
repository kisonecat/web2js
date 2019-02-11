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

      /*
      var thenType = Binaryen.getExpressionType(theThen);
      var elseType = Binaryen.getExpressionType(theElse);      

      if ((thenType == Binaryen.unreachable) && (elseType != Binaryen.unreachable))
        return theElse;

      if ((elseType == Binaryen.unreachable) && (thenType != Binaryen.unreachable))
        return theThen;      

      if ((thenType == Binaryen.unreachable) && (elseType == Binaryen.unreachable))
          return module.unreachable();
      */
      
      return module.if( this.expression.generate(environment),
                        theThen, theElse );
    } else {
      return module.if( this.expression.generate(environment),
                        this.result.generate(environment) );
    }
  }
};
