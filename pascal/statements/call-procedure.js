'use strict';
var Binaryen = require('binaryen');
var Environment = require('../environment.js');
var FunctionEvaluation = require('../function-evaluation.js');

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

    // No need for "break-in" functions
    if (this.procedure.name.toLowerCase() == "break") {
      return module.nop();
    }
    if (this.procedure.name.toLowerCase() == "breakin") {
      return module.nop();
    }
    
    // Ignore the mode parameter to reset
    if (this.procedure.name.toLowerCase() == "reset") {
      var file = this.params[0];
      file.generate(environment);

      var filename = this.params[1];
      var filenameExp = filename.generate(environment);
      var result = undefined;

      if (filename.type.name == "string") {
        result = module.call( "reset", [module.i32.load8_u(0,0,filenameExp),
                                        module.i32.add(module.i32.const(1),filenameExp)],
                              Binaryen.i32 );
      } else {
        result = module.call( "reset", [module.i32.const(filename.type.index.range()),
                                        filename.variable.pointer()],
                              Binaryen.i32 );
      }
      
      return file.variable.set( result );
    }

    // FIXME
    if (this.procedure.name == "readln") {
      return module.nop();
    }

    // FIXME
    if (this.procedure.name == "read") {
      return module.nop();
    }

    // FIXME
    if (this.procedure.name == "get") {
      return module.nop();
    }

    // FIXME
    if (this.procedure.name == "put") {
      return module.nop();
    }

    // FIXME
    if (this.procedure.name == "close") {
      return module.nop();
    }

    // FIXME
    if (this.procedure.name == "rewrite") {
      return module.nop();
    }

    if ((this.procedure.name == "writeln") || (this.procedure.name == "write")) {
      var printers = this.params.map( function(p) {
        if (p.width)
          p = p.expression;
        
        var q = p.generate(environment);
        var type = environment.resolveType( p.type );

        var printer = undefined;
        
        if (type.fileType) {
          return module.nop();
        }
        
        if (type.isInteger())
          printer = "printInteger";

        if (type.name == "real")        
          printer = "printFloat";

        if (type.name == "boolean")        
          printer = "printBoolean";        

        if (type.name === "string")
          printer = "printString";

        if (type.name === "char")
          printer = "printChar";        

        if (printer === undefined)
          throw 'Could not print.';
        
        return module.call( printer, [q], Binaryen.none );
      });

      if (this.procedure.name == "writeln")
        printers.push( module.call( "printNewline", [], Binaryen.none ) );

      return module.block( null, printers );
    }

    var f = new FunctionEvaluation( this.procedure, this.params );

    var code = f.generate(environment);

    if (f.type == undefined)
      return code;
    else
      return module.drop(code);
  }
};
