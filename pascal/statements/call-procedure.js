'use strict';

module.exports = class CallProcedure {
  constructor(procedure,params) {
    this.procedure = procedure;
    this.params = params;
  }

  gotos() {
    return [];
  }
  
  generate(block) {
    var prefix = "";
    
    if ((this.procedure == "reset") || (this.procedure == "rewrite") || (this.procedure == "writeln") || (this.procedure == "readln") || (this.procedure == "write")) {
      var handle = this.params.shift();
      prefix = `${handle}.`;
    }

    if (this.procedure == "read") {
      var handle = this.params.shift();
      var code = "";

      for( var i in this.params ) {
        var v = this.params[i];
        code = code + `${v} = ${handle}.${this.procedure}();\n`
      }
      return code;
    }    
    
    return `${prefix}${this.procedure}(${this.params.map( function(p) { if (p.generate) return p.generate(block); else return p.toString() })});`
  }
};
