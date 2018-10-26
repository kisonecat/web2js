'use strict';

module.exports = class TypeDeclaration {
  constructor(name,expression) {
    this.name = name;
    this.expression = expression;
  }

  toString() {
    return `// type ${this.name} = ${this.expression};`;
  }

};

