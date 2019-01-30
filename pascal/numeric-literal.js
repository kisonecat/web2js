'use strict';
var Binaryen = require('binaryen');
var Environment = require('./environment.js');

module.exports = class NumericLiteral {
  constructor(n, isInteger) {
    this.number = n;
    this.isInteger = isInteger;
  }

  generate(environment) {
    var environment = new Environment(environment);
    var m = environment.module;

    if (this.isInteger)
      return m.i32.const( this.number.toString() );
    else
      return m.f64.const( this.number.toString() );
  }
};
