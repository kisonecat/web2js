'use strict';

module.exports = class ExpressionWithWidth {
  constructor(expression,width) {
    this.expression = expression;
    this.width = width;
  }

  generate(e) {
    return this.expression.generate(e) + `/*with width ${this.width}*/`;
  }
};
