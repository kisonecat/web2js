'use strict';

module.exports = class UnaryOperation {
  constructor(operator, operand) {
    this.operator = operator;
    this.operand = operand;
  }

  toString() {
    return `(${this.operator} (${this.operand2}))`;
  }

};
