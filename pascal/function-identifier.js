'use strict';

module.exports = class FunctionIdentifier {
  constructor(name) {
    this.name = name;
  }

  toString() {
    if (this.name === "break")
      return "_break";
    
    return this.name;
  }  
};
