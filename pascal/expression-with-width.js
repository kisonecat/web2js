'use strict';

module.exports = class ExpressionWithWidth {
  constructor(expression,width) {
    this.expression = expression;
    this.width = width;
  }

  toString() {
    return this.expression.toString() + `/*with width ${this.width}*/`;
  }
};
