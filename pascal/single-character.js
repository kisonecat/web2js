'use strict';
var Type = require('./type.js');

module.exports = class SingleCharacter {
  constructor(character) {
    this.character = character.replace(/^'/,'').replace(/'$/,'').replace(/''/,"'");
    this.type = new Type('char');
  }

  generate(environment) {
    var m = environment.module;
    var c = this.character;
    return m.i32.const( c.charCodeAt(0) );
  }
};
