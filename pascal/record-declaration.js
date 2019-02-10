'use strict';

module.exports = class RecordDeclaration {
  constructor(names,type) {
    this.names = names;
    this.type = type;
  }

  bytes(e) {
    return this.type.bytes(e) * this.names.length;
  }
  
  generate(e) {
    return `${this.names} = ${this.type.generate(e)}`;
  }
};
