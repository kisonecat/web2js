'use strict';

module.exports = class Operation {
  constructor(operator, operand1, operand2) {
    this.operator = operator;
    this.operand1 = operand1;
    this.operand2 = operand2;    
  }

  toString() {
    return `((${this.operand1}) ${this.operator} (${this.operand2}))`;
  }
}
