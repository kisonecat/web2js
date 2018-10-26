'use strict';

module.exports = class StringLiteral {
  constructor(text) {
    this.text = text;
  }

  toString() {
    return `${this.text}`;
  }
}
