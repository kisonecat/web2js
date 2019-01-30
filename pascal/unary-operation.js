'use strict';
var Binaryen = require('binaryen');

module.exports = class UnaryOperation {
  constructor(operator, operand) {
    this.operator = operator;
    this.operand = operand;
  }

  generate(environment) {
    var module = environment.module;
    var a = this.operand.generate(environment);
    
    if (this.operator == "+")
      return a;

    if (this.operator == "-") {
      if (Binaryen.getExpressionType(a) == Binaryen.i32) {
        return module.i32.mul( module.i32.const(-1), a );
      }

      if (Binaryen.getExpressionType(a) == Binaryen.f64) {
        return module.f64.neg(a);
      }
    }

    throw "Unknown unary operator " + this.operator;
    return module.nop();
  }

};
