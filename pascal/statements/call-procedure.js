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
        var q = p.generate(environment);
        var type = environment.resolveType( p.type );        
        var printer = "print";
        
        if (type.name == "integer")
          printer = "printInteger";

        if (type.name == "real")        
          printer = "printFloat";

        if (type.name == "boolean")        
          printer = "printBoolean";        

        if (type.name === "string")
          printer = "printString";

        if (type.name === "char")
          printer = "printChar";        

        return module.call( printer, [q], Binaryen.none );
      });

      if (this.procedure.name == "writeln")
        printers.push( module.call( "printNewline", [], Binaryen.none ) );
      
      return module.block( null, printers );
    }

    var compiledParams = this.params.map( function(p) { return p.generate(environment); } );

    return module.call( this.procedure.name, compiledParams, Binaryen.none );
  }
};
