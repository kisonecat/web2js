'use strict';
var Binaryen = require('binaryen');
var Environment = require('./environment.js');
var Type = require('./type.js');

module.exports = class NumericLiteral {
  constructor(n, type) {
    this.number = n;
    this.type = type;
  }

  generate(environment) {
    environment = new Environment(environment);
    var m = environment.module;

    if (this.type.name == "integer")
      return m.i32.const( this.number );

    if (this.type.name == "boolean")
      return m.i32.const( this.number );

    if (this.type.name == "real")
      return m.f64.const( this.number );
  }
};
