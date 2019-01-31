'use strict';

module.exports = class ExpressionWithWidth {
  constructor(expression,width) {
    this.expression = expression;
    this.width = width;
  }

  generate(e) {
    // FIXME: ignore width specification
    return this.expression.generate(e);
  }
};
