'use strict';

module.exports = class ProcedureIdentifier {
  constructor(name) {
    this.name = name;
  }
  
  toString() {
    return this.name;
  }
};
