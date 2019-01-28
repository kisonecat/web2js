'use strict';

module.exports = class Repeat {
  constructor(expression, statement) {
    this.expression = expression;
    this.statement = statement;
  }

  gotos() {
    return this.statement.gotos();
  }
  
  generate(block) {
    var code = `do {\n`;

    code = code + this.statement.generate(block);
    code = code + "\n";      

    if (this.expression.generate)
      code = code + `} while (!(${this.expression.generate(block)}));`;
    else
      code = code + `} while (!(${this.expression}));`;
    

  return code;

  }
};
