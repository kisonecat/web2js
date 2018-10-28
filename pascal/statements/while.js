'use strict';

module.exports = class While {
  constructor(expression, statement) {
    this.expression = expression;
    this.statement = statement;
  }

  gotos() {
    return this.statement.gotos();
  }

  generate(block) {
    var code;
    if (this.expression.generate)
      code = `while (${this.expression.generate(block)}) \n`;
    else
      code = `while (${this.expression}) \n`;      

    code = code + this.statement.generate(block);

  return code;
  }

};
