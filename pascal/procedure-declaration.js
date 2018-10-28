'use strict';

module.exports = class ProcedureDeclaration {
  constructor(identifier, params, block) {
    this.identifier = identifier;
    this.params = params;
    this.block = block;
  }

  generate(block) {
    var code  = "";
    var params = [];

    for( var i in this.params ) {
      var param = this.params[i];

      for( var j in param.names ) {
        var name = param.names[j];
        params.push( name );
      }
    }
    
    code = code + `function ${this.identifier}(${params.join(',')}) {\n`;
    code = code + `trace("${this.identifier}");\n`;
    
    code = code + this.block.generate(block);
    code = code + "}\n";
    
    return code;
  }
};

