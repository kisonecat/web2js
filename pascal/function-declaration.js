'use strict';

module.exports = class FunctionDeclaration {
  constructor(identifier, params, resultType, block) {
    this.identifier = identifier;
    this.params = params;
    this.resultType = resultType;
    this.block = block;
  }

  generate(environment) {
    var code  = "";
    var params = [];

    for( var i in this.params ) {
      var param = this.params[i];

      for( var j in param.names ) {
        var name = param.names[j];
        params.push( name );
      }
    }

    environment.functionIdentifier = this.identifier;
    
    code = code + `function ${this.identifier}(${params.join(',')}) {\n`;
    code = code + `trace("${this.identifier}");\n`;
    code = code + `var _${this.identifier}; /* has result type ${this.resultType} */\n`;
    code = code + this.block.generate(environment);
    code = code + `return _${this.identifier};\n`;
    code = code + "}\n";

    environment.functionIdentifier = undefined;
    
    return code;
  }
  
};

