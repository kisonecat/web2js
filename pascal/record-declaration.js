'use strict';

module.exports = class RecordDeclaration {
  constructor(names,type) {
    this.names = names;
    this.type = type;
  }

  generate(e) {
    return `${this.names} = ${this.type.generate(e)}`;
  }
};
