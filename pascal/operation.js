'use strict';
var Binaryen = require('binaryen');
var Environment = require('./environment.js');
var Identifier = require('./identifier.js');

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
    
    var typeA = environment.resolveType( this.operand1.type );
    var typeB = environment.resolveType( this.operand2.type );    
    
    var family = undefined;

    if ((typeA.name == "boolean") && (typeB.name == "boolean")) {
      family = m.i32;
      this.type = new Identifier("boolean");
    }
    
    if (this.operator === "&&") {
      if ((typeA.name == "boolean" && typeB.name == "boolean"))
        return family.and(a,b);
      else
        throw "Can only 'and' on boolean types."
    }

    if (this.operator === "||") {
      if ((typeA.name == "boolean" && typeB.name == "boolean"))
        return family.or(a,b);
      else
        throw "Can only 'or' on boolean types."      
    }

    if ((typeA.name == "integer") && (typeB.name == "integer")) {
      family = m.i32;
      this.type = new Identifier("integer");
    }

    if ((typeA.name == "real") && (typeB.name == "integer")) {
      b = m.f64.convert_s.i32(b);
      typeB = new Identifier("real");
      family = m.f64;
      this.type = new Identifier("real");
    }

    if ((typeA.name == "integer") && (typeB.name == "real")) {    
      a = m.f64.convert_s.i32(a);
      typeA = new Identifier("real");      
      family = m.f64;
      this.type = new Identifier("real");            
    }

    if ((typeA.name == "real") && (typeB.name == "real")) {    
      family = m.f64;
      this.type = new Identifier("real");       
    }

    if (family === undefined) {
      throw `Could not determine types for operator.`
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
      if (typeB.name != "real")
        b = m.f64.convert_s.i32(b);
      
      if (typeA.name != "real")
        a = m.f64.convert_s.i32(a);
      
      this.type = new Identifier("real");            
      return m.f64.div( a, b );
    }

    if (this.operator === "==") {
      this.type = new Identifier("boolean"); 
      return family.eq(a,b);
    }

    if (this.operator === "!=") {
      this.type = new Identifier("boolean"); 
      return family.ne(a,b);
    }

    if (family === m.i32) {
      if (this.operator === "<") { this.type = new Identifier("boolean"); return family.lt_s(a,b); }
      if (this.operator === ">") { this.type = new Identifier("boolean"); return family.gt_s(a,b); }
      if (this.operator === ">=") { this.type = new Identifier("boolean"); return family.ge_s(a,b); }
      if (this.operator === "<=") { this.type = new Identifier("boolean"); return family.le_s(a,b); }
    }

    if (family === m.f64) {
      if (this.operator === "<") { this.type = new Identifier("boolean"); return family.lt(a,b); }
      if (this.operator === ">") { this.type = new Identifier("boolean"); return family.gt(a,b); }
      if (this.operator === ">=") { this.type = new Identifier("boolean"); return family.ge(a,b); }
      if (this.operator === "<=") { this.type = new Identifier("boolean"); return family.le(a,b); }
    }


    if (this.operator === "%") {
      return family.rem_s(a,b);
    }

    throw `Could not parse operator ${this.operator}`;
    return m.nop();;
  }
  
};
