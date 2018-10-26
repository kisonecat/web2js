'use strict';

module.exports = class FunctionDeclaration {
  constructor(identifier, params, resultType, block) {
    this.identifier = identifier;
    this.params = params;
    this.resultType = resultType;
    this.block = block;
  }

  toString() {
    var code  = "";

    code = code + `function ${this.identifier}(${this.params}) {\n`;

    code = code + this.block.toString();
    code = code + "}\n";
    
    return code;
  }
  
};

