'use strict';

module.exports = class VariableDeclaration {
  constructor(names,type) {
    this.names = names;
    this.type = type;
  }

  toString() {
    return `var ${this.names}; /* has type ${this.type} */`;
  }  
}
