'use strict';

module.exports = class ConstantDeclaration {
  constructor(identifier,expression) {
    this.name = identifier.name;
    this.expression = expression;
  }

  toString() {
    return `const ${this.name} = ${this.expression};`;
  }
};
