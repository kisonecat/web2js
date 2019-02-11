'use strict';
var Identifier = require('./identifier.js');

module.exports = class StringLiteral {
  constructor(text) {
    this.text = text.replace(/^'/,'').replace(/'$/,'').replace(/''/,"'");
    this.type = new Identifier('string');    
  }

  generate(environment) {
    var t = this.text;
    var module = environment.module;
    var pointer = environment.program.memory.allocateString( t );

    return module.i32.const( pointer );
  }
};
