'use strict';

module.exports = class SingleCharacter {
  constructor(character) {
    this.character = character.replace(/^'/,'').replace(/'$/,'').replace(/''/,"'");
  }

  generate() {
    var c = this.character;
    if (c === "\\") { c = "\\\\"; }
    if (c === "'") { c = '\\\''; }    
    return `'${c}'.charCodeAt(0)`;
  }
};
