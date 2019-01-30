'use strict';

module.exports = class SingleCharacter {
  constructor(character) {
    this.character = character.replace(/^'/,'').replace(/'$/,'').replace(/''/,"'");
  }

  generate(environment) {
    var m = environment.module;
    var c = this.character;
    if (c === "\\") { c = "\\\\"; }
    if (c === "'") { c = '\\\''; }    
    return m.i32.const( c.charCodeAt(0) );
  }
};
