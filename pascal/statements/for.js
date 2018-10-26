'use strict';

module.exports = class For {
  constructor(variable, start, end, skip, statement) {
    this.variable = variable;
    this.start = start;
    this.end = end;
    this.skip = skip;
    this.statement = statement;
  }

  toString() {
    
    var code;

    if (this.skip == 1) {
      code = `for (${this.variable}=${this.start}; ${this.variable} <= ${this.end}; ${this.variable}++) \n`;
    } else {
      code = `for (${this.variable}=${this.start}; ${this.variable} >= ${this.end}; ${this.variable}--) \n`;
    }

    code = code + this.statement.toString();

    return code;
    
  }
};
