'use strict';

module.exports = class ProcedureDeclaration {
  constructor(identifier, params, block) {
    this.identifier = identifier;
    this.params = params;
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

