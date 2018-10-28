'use strict';

module.exports = class FunctionIdentifier {
  constructor(name) {
    this.name = name;
  }

  generate(e) {
    if (this.name === "break")
      return "_break";
    
    return this.name;
  }  
};
