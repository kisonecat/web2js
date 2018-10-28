'use strict';

module.exports = class Conditional {
  constructor(expression, result, otherwise) {
    this.expression = expression;
    this.result = result;
    this.otherwise = otherwise;    
  }

  gotos() {
    var g = this.result.gotos();
    
    if (this.otherwise) {
      g = g.concat( this.otherwise.gotos() );
    }
    
    return g;
  }

  
  toString() {
    this.generate(undefined);
  }
  
  generate(block) {
    var code;
    if (this.expression.generate)
      code = `if (${this.expression.generate(block)}) {\n`;
    else
      code = `if (${this.expression}) {\n`;      

    code = code + this.result.generate(block);

    code = code + "}";
    
    if (this.otherwise) {
      code = code + "else {\n";
      code = code + this.otherwise.generate(block);
      code = code + "}";      
    }
    
    return code;
  }
};
