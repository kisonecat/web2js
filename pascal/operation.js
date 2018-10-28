'use strict';

module.exports = class Operation {
  constructor(operator, operand1, operand2) {
    this.operator = operator;
    this.operand1 = operand1;
    this.operand2 = operand2;    
  }

  generate(block) {
    var a, b;

    a = this.operand1.generate(block);
    b = this.operand2.generate(block);    
    
    // BADBAD
    if (this.operator === 'div') {
      return `((${a}) / (${b}))`;
    }
    
    return `((${a}) ${this.operator} (${b}))`;
  }
  
};
