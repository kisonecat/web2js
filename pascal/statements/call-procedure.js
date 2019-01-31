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
    
    if (this.procedure.name == "writeln") {
      var params = this.params.map( function(p) { return p.generate(environment); } );
      var types = params.map( function(p) {
        if (Binaryen.getExpressionType(p) == Binaryen.i32)
          return 'i';
        else
          return 'f';
      } ).join('');
      return module.call( "log-" + types, params, Binaryen.none );
    }

    var compiledParams = this.params.map( function(p) { return p.generate(environment); } );

    return module.call( this.procedure.name, compiledParams, Binaryen.none );
  }
};
