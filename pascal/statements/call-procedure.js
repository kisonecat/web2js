'use strict';
var Binaryen = require('binaryen');
var Environment = require('../environment.js');

module.exports = class CallProcedure {
  constructor(procedure,params) {
    this.procedure = procedure;
    this.params = params;
  }

  gotos() {
    return [];
  }
  
  generate(environment) {
    module = environment.module;
    
    var prefix = "";

    if (this.procedure.name == "writeln") {
      return module.call( "log", [this.params[0].generate(environment)], Binaryen.none );
    }
    /*
    if (this.procedure.name == "read") {
      var handle = this.params.shift().generate(block);
      var code = "";

      for( var i in this.params ) {
        var v = this.params[i];
        code = code + `${v.generate(block)} = ${handle}.${this.procedure.generate(block)}();\n`
      }
      return code;
    }    
    
    return `${prefix}${this.procedure.generate(block)}(${this.params.map( function(p) { if (p.generate) return p.generate(block); else return p.toString() })});`
    */
  }
};
