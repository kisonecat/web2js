'use strict';
var Identifier = require('./identifier.js');

module.exports = class SingleCharacter {
  constructor(character) {
    this.character = character.replace(/^'/,'').replace(/'$/,'').replace(/''/,"'");
    this.type = new Identifier('char');
  }

  generate(environment) {
    var m = environment.module;
    var c = this.character;
    return m.i32.const( c.charCodeAt(0) );
  }
};
