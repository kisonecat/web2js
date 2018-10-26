'use strict';

module.exports = class ConstantDeclaration {
  constructor(name,expression) {
    this.name = name;
    this.expression = expression;
  }

  toString() {
    return `const ${this.name} = ${this.expression};`;
  }
};
