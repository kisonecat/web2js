'use strict';

module.exports = class For {
  constructor(variable, start, end, skip, statement) {
    this.variable = variable;
    this.start = start;
    this.end = end;
    this.skip = skip;
    this.statement = statement;
   }
};
