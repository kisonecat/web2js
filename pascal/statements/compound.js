'use strict';

module.exports = class Compound {
  constructor(statements) {
    this.statements = statements;
  }

  toString() {
    var code = "{\n";

    this.statements.forEach( function(v) {
      code = code + v.toString();
      code = code + "\n";      
    });
    
    code = code + "}\n";

  return code;
  }

};
