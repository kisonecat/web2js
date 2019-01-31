'use strict';
var Binaryen = require('binaryen');
var Environment = require('./environment.js');

module.exports = class Operation {
  constructor(operator, operand1, operand2) {
    this.operator = operator;
    this.operand1 = operand1;
    this.operand2 = operand2;    
  }

  generate(environment) {
    environment = new Environment(environment);
    var m = environment.module;
    
    var a, b;

    a = this.operand1.generate(environment);
    b = this.operand2.generate(environment);
    
    var family = undefined;

    if ((Binaryen.getExpressionType(a) == Binaryen.i32) && (Binaryen.getExpressionType(b) == Binaryen.i32)) {
      family = m.i32;
    } else if ((Binaryen.getExpressionType(a) == Binaryen.f64) && (Binaryen.getExpressionType(b) == Binaryen.i32)) {
      b = m.f64.convert_s.i32(b);
      family = m.f64;
    } else if ((Binaryen.getExpressionType(a) == Binaryen.i32) && (Binaryen.getExpressionType(b) == Binaryen.f64)) {
      a = m.f64.convert_s.i32(a);
      family = m.f64;
    } else if ((Binaryen.getExpressionType(a) == Binaryen.f64) && (Binaryen.getExpressionType(b) == Binaryen.f64)) {
      family = m.f64;
    }

    if (family === undefined) {
      throw "Could not determine types for operator.";
    }

    if (this.operator === "+") {
      return family.add( a, b );
    }
    
    if (this.operator === "-") {
      return family.sub( a, b );
    }

    if (this.operator === "*") {
      return family.mul( a, b );
    }

    if (this.operator === "div") {
      return family.div_s( a, b );
    }

    if (this.operator === "/") {
      if (Binaryen.getExpressionType(b) == Binaryen.i32)
        b = m.f64.convert_s.i32(b);
      if (Binaryen.getExpressionType(a) == Binaryen.i32)
        a = m.f64.convert_s.i32(a);      
        
      return m.f64.div( a, b );
    }

    if (this.operator === "==") {
      return family.eq(a,b);
    }

    if (this.operator === "!=") {
      return family.ne(a,b);
    }

    if (family === m.i32) {
      if (this.operator === "<") return family.lt_s(a,b);
      if (this.operator === ">") return family.gt_s(a,b);
      if (this.operator === ">=") return family.ge_s(a,b);
      if (this.operator === "<=") return family.le_s(a,b);
    }

    if (family === m.f64) {
      if (this.operator === "<") return family.lt(a,b);
      if (this.operator === ">") return family.gt(a,b);
      if (this.operator === ">=") return family.ge(a,b);
      if (this.operator === "<=") return family.le(a,b);
    }
    
    if (this.operator === "&&") {
      return family.and(a,b);
    }

    if (this.operator === "||") {
      return family.or(a,b);
    }

    if (this.operator === "%") {
      return family.rem_s(a,b);
    }

    throw `Could not parse operator ${this.operator}`;
    return;
  }
  
};
