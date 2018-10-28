'use strict';

module.exports = class For {
  constructor(variable, start, end, skip, statement) {
    this.variable = variable;
    this.start = start;
    this.end = end;
    this.skip = skip;
    this.statement = statement;
  }

  gotos() {
    return this.statement.gotos();
  }

  
  generate(block) {
    var v = this.variable;
    if (v.generate)
      v = v.generate(block);
    else
      v = v.toString();

    var start;
    if (this.start.generate)
      start = this.start.generate(block);
    else
      start = this.start.toString();

    var end;
    if (this.end.generate)
      end = this.end.generate(block);
    else
      end = this.end.toString();
    
    
    var code;

    if (this.skip == 1) {
      code = `for (${v}=${start}; ${v} <= ${end}; ${v}++) \n`;
    } else {
      code = `for (${v}=${start}; ${v} >= ${end}; ${v}--) \n`;
    }

    if (this.statement.generate)
      code = code + this.statement.generate(block);
    else
      code = code + this.statement.toString();

    return code;
    
  }
};
