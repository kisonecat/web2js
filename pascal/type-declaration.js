'use strict';

module.exports = class TypeDeclaration {
  constructor(identifier,expression) {
    this.name = identifier.name;
    this.expression = expression;
  }

  generate(e) {
    return `// type ${this.name.generate(e)} = ${this.expression.generate(e)};`;
  }

};

