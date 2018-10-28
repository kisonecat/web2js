'use strict';

module.exports = class ProcedureIdentifier {
  constructor(name) {
    this.name = name;
  }
  
  toString() {
    if (this.name === "break")
      return "_break";
    
    return this.name;
  }
};
