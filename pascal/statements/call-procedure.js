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
    
    // Ignore the mode parameter to reset
    if (this.procedure.name.toLowerCase() == "reset") {
      var file = this.params[0];
      file.generate(environment);

      var filename = this.params[1];
      var filenameExp = filename.generate(environment);
      var result = undefined;
      
      if (filename.type.name == "string")
        result = module.call( "reset", [module.i32.load8_u(0,0,filenameExp),
                                        module.i32.add(1,filenameExp)],
                              Binaryen.i32 );
      else
        result = module.call( "reset", [module.i32.const(filename.type.index.range()),
                                        filename.variable.pointer()],
                              Binaryen.i32 );
      
      return file.variable.set( result );
    }
    
    if ((this.procedure.name == "writeln") || (this.procedure.name == "write")) {
      var printers = this.params.map( function(p) {
        var q = p.generate(environment);
        var type = environment.resolveType( p.type );
        var printer = "print";

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

        return module.call( printer, [q], Binaryen.none );
      });

      if (this.procedure.name == "writeln")
        printers.push( module.call( "printNewline", [], Binaryen.none ) );
/*
      if (this.procedure.name == "writeln") {
        printers.push( module.call( "printNewline", [], Binaryen.none ) );                
        printers.push( module.call( "printChar", [module.i32.const(65)], Binaryen.none ) );        
        printers.push( module.call( "printInteger", [module.global.get("stack")], Binaryen.none ) );

        printers.push( module.call( "printNewline", [], Binaryen.none ) );        
        printers.push( module.call( "printInteger", [module.i32.load( 0, 0, module.i32.sub( module.global.get("stack"), module.i32.const(8)))], Binaryen.none ) );

        
        printers.push( module.call( "printNewline", [], Binaryen.none ) );        
        printers.push( module.call( "printInteger", [module.i32.load( 0, 0, module.i32.sub( module.global.get("stack"), module.i32.const(4)))], Binaryen.none ) );

        printers.push( module.call( "printNewline", [], Binaryen.none ) );
        printers.push( module.call( "printChar", [module.i32.const(66)], Binaryen.none ) );        
        printers.push( module.call( "printInteger", [module.i32.load( 0, 0, module.global.get("stack"))], Binaryen.none ) );
        printers.push( module.call( "printNewline", [], Binaryen.none ) );        
        printers.push( module.call( "printInteger", [module.i32.load( 4, 0, module.global.get("stack"))], Binaryen.none ) );
        printers.push( module.call( "printNewline", [], Binaryen.none ) );        
        printers.push( module.call( "printInteger", [module.i32.load( 8, 0, module.global.get("stack"))], Binaryen.none ) );
        printers.push( module.call( "printNewline", [], Binaryen.none ) );        
        printers.push( module.call( "printInteger", [module.i32.load( 12, 0, module.global.get("stack"))], Binaryen.none ) );        
        printers.push( module.call( "printNewline", [], Binaryen.none ) );        
        printers.push( module.call( "printInteger", [module.i32.load( 16, 0, module.global.get("stack"))], Binaryen.none ) );        
        printers.push( module.call( "printNewline", [], Binaryen.none ) );        
        printers.push( module.call( "printInteger", [module.i32.load( 20, 0, module.global.get("stack"))], Binaryen.none ) );        
        printers.push( module.call( "printNewline", [], Binaryen.none ) );
        printers.push( module.call( "printNewline", [], Binaryen.none ) );                
      }
      */
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
