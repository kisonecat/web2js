'use strict';

module.exports = class TypeDeclaration {
  constructor(name,expression) {
    this.name = name;
    this.expression = expression;
  }

  generate(e) {
    return `// type ${this.name.generate(e)} = ${this.expression.generate(e)};`;
  }

};

