'use strict';

var trampoline = 1;

module.exports = class Compound {
  constructor(statements) {
    this.statements = statements;
  }

  gotos() {
    var g = [];
    this.statements.forEach( function(f) {
      g = g.concat(f.gotos());
    });
    return g;
  }
  
  generate(environment) {
    var code = "{\n";

    var labelCount = 0;
    this.statements.forEach( function(v) {
      if (v.label && v.statement) {
        labelCount = labelCount + 1;
      }
    });

    if (labelCount > 0) {
      var theTrampoline = trampoline;
      trampoline = trampoline + 1;

      code = code + `var goto${theTrampoline} = 0;\n`;
      code = code + `trampoline${theTrampoline}: while (true) {`;
      code = code + `switch(goto${theTrampoline}) {`;
      code = code + `case 0:`;

      this.statements.forEach( function(v) {
        if (v.label && v.statement) {
          environment.labels[v.label] = `goto${theTrampoline} = ${v.label}; continue trampoline${theTrampoline};`;
        }
      });
    }

    this.statements.forEach( function(v) {
      if (v.label && v.statement) {
        code = code + `case /*label*/${v.label}:`;
        v = v.statement;
      }
      
      if (v.generate) {
        code = code + v.generate(environment);
      } else {
        code = code + v.toString();
      }
      code = code + "\n";      
    });

    if (labelCount > 0) {
      code = code + `}\n`;
      code = code + `break trampoline${theTrampoline};`;
      code = code + `}\n`;      
    }
    
    code = code + "}\n";

  return code;
  }

};


