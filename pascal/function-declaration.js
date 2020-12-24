'use strict';

var Binaryen = require('binaryen');
var Environment = require('./environment.js');
var PointerType = require('./pointer-type.js');
var FunctionEvaluation = require('./function-evaluation.js');

var id = 0;

module.exports = class FunctionDeclaration {
  constructor(identifier, params, resultType, block) {
    this.identifier = identifier;
    this.params = params;
    this.resultType = resultType;
    this.block = block;
  }

  generate(environment) {
    var parentEnvironment = environment;
    environment = new Environment(environment, this.identifier.name);
    var module = environment.module;

    var inputs = [];
    var index = 0;

    var result = Binaryen.none;
    var resultVariable;

    var offset = 0;
    
    function addVariable( name, type ) {
      type = environment.resolveType(type);

      environment.variables[name] = environment.program.stack.variable( name, type, offset );

      offset = offset + type.bytes();
    }

    if (this.resultType) {
      var resolved = environment.resolveType( this.resultType );
      result = resolved.binaryen();
      addVariable( this.identifier.name, this.resultType );
      resultVariable = environment.variables[this.identifier.name];
    }

    parentEnvironment.functions[this.identifier.name] = {
      resultType: this.resultType,
      params: this.params,
      identifier: this.identifier,
      evaluate: function(params) {
        return (new FunctionEvaluation( this.identifier, params ));
      }
    };

    if (this.block === null) {
      return;
    }
    
    this.block.vars.forEach( function(v) {
      for (var i in v.names) {
        addVariable( v.names[i].name, v.type );
      }
    });

    for( var i in this.params ) {
      var param = this.params[i];
      var type = environment.resolveType(param.type);

      if ( param.reference )
        type = new PointerType( type );
      
      for( var j in param.names ) {
        offset += type.bytes();
      }
    }

    var paramOffset = 0;
    
    for( var i in this.params ) {
      var param = this.params[i];
      var type = environment.resolveType(param.type);

      if (param.reference) {
        type = new PointerType( type );
      }
      
      for( var j in param.names ) {
        paramOffset += type.bytes();
        
        var v = environment.program.stack.variable( param.names[j].name, type, offset - paramOffset );
        
        if (param.reference) {
          environment.variables[param.names[j].name] =
            environment.program.memory.dereferencedVariable( param.names[j].name, type.referent, v );
        } else
          environment.variables[param.names[j].name] = v;
      }
    }

    var functionType = module.addFunctionType(null, result, []);

    var code = this.block.generate(environment);

    environment.program.traces[id] = this.identifier.name;
    
    if (resultVariable) {
      code = module.block( null, [ environment.program.stack.extend( offset - paramOffset ),
                                   module.local.set(0, module.global.get( "stack", Binaryen.i32 )),
                                   code,
                                   module.local.set(1, resultVariable.get() ),
                                   environment.program.stack.shrink( offset ),
                                   module.return( module.local.get( 1, result ) )] );
      
      module.addFunction(this.identifier.name, functionType, [Binaryen.i32, result], code);
    } else {
      code = module.block( null, [ environment.program.stack.extend( offset - paramOffset ),
                                   module.local.set(0, module.global.get( "stack", Binaryen.i32 )),
                                   code,
                                   environment.program.stack.shrink( offset ),
                                   ] );
      module.addFunction(this.identifier.name, functionType, [Binaryen.i32], code);
    }
    
    id = id + 1;
    
    return;
  }
  
};
