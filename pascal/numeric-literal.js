'use strict';
var Binaryen = require('binaryen');
var Environment = require('./environment.js');
var Identifier = require('./identifier.js');

module.exports = class NumericLiteral {
  constructor(n, type) {
    this.number = n;

    if (type)
      this.type = type;
    else
      this.type = new Identifier("integer");
  }

  generate(environment) {
    environment = new Environment(environment);
    var m = environment.module;

    if (this.type.name == "integer")
      return m.i32.const( this.number );

    if (this.type.name == "boolean")
      return m.i32.const( this.number );

    if (this.type.name == "real")
      return m.f32.const( this.number );

    throw `Could not create numeric constant for ${this.number} with ${this.type}`;
    return m.nop();
  }
};
