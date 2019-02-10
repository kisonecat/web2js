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
