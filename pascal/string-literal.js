'use strict';
var Type = require('./type.js');

module.exports = class StringLiteral {
  constructor(text) {
    this.text = text.replace(/^'/,'').replace(/'$/,'').replace(/''/,"'");
    this.type = new Type('string');    
  }

  generate(environment) {
    var t = this.text;
    var module = environment.module;

    return module.i32.const( environment.program.memory.allocateString( t ) );
  }
};
