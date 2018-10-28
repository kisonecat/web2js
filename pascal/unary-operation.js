'use strict';

module.exports = class UnaryOperation {
  constructor(operator, operand) {
    this.operator = operator;
    this.operand = operand;
  }

  generate(block) {
    var a;

    a = this.operand.generate(block);
    
    return `(${this.operator} (${a}))`;
  }
  

};
