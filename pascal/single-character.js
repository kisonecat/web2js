'use strict';

module.exports = class SingleCharacter {
  constructor(character) {
    this.character = character;
  }

  toString() {
    return `"${this.character}".charCodeAt(0)`;
  }
};
