'use strict';

module.exports = class While {
  constructor(expression, statement) {
    this.expression = expression;
    this.statement = statement;
  }

  toString() {
  var code = `while (${this.expression}) \n`;

    code = code + this.statement.toString();

  return code;
  }

};
