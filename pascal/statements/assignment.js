'use strict';
var Binaryen = require('binaryen');

var Desig = require('../desig');

module.exports = class Assignment {
  constructor(lhs,rhs) {
    this.lhs = lhs;
    this.rhs = rhs;
  }

  gotos() {
    return [];
  }
  
  generate(environment) {
    var module = environment.module;

    var rhs = this.rhs.generate(environment);
    var rhsType = environment.resolveType( this.rhs.type );
    var lhs = this.lhs.generate(environment);
    var lhsType = environment.resolveType( this.lhs.type );

    if ((this.rhs.type.name == "string") && (this.lhs.type.componentType)) {
      throw 'Can not handle assignment of string to array';
    }
    
    if ((this.rhs.type.name == "integer") && (this.lhs.type.name == "real")) {
      return environment.resolveVariable(this.lhs).set(
        module.f64.convert_s.i32(rhs) );      
    }
    
    return this.lhs.variable.set( rhs );
  }
};
