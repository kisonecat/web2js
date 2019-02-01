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
    var module = environment.module;
    
    if ((this.procedure.name == "writeln") || (this.procedure.name == "write")) {
      var printers = this.params.map( function(p) {
        p = p.generate(environment);
        
        var printer = "print";
        if (Binaryen.getExpressionType(p) == Binaryen.i32)
          printer = "printInteger";
        else
          printer = "printFloat";
        
        return module.call( printer, [p], Binaryen.none );
      });

      if (this.procedure.name == "writeln")
        printers.push( module.call( "printNewline", [], Binaryen.none ) );
      
      return module.block( null, printers );
    }

    var compiledParams = this.params.map( function(p) { return p.generate(environment); } );

    return module.call( this.procedure.name, compiledParams, Binaryen.none );
  }
};
