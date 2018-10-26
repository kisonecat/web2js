'use strict';

module.exports = class Conditional {
  constructor(expression, result, otherwise) {
    this.expression = expression;
    this.result = result;
    this.otherwise = otherwise;    
  }

  toString() {
    var code = `if (${this.expression}) {\n`;

    code = code + this.result.toString();

    code = code + "}";
    if (this.otherwise) {
      code = code + "else {\n";
      code = code + this.otherwise.toString();
      code = code + "}";      
    }
    
    return code;
  }
};
