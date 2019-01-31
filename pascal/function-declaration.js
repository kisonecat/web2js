'use strict';

var Binaryen = require('binaryen');
var Environment = require('./environment.js');

module.exports = class FunctionDeclaration {
  constructor(identifier, params, resultType, block) {
    this.identifier = identifier;
    this.params = params;
    this.resultType = resultType;
    this.block = block;
  }

  generate(environment) {
    environment = new Environment(environment);
    var module = environment.module;

    var params = [];
    var inputs = [];
    var index = 0;
    
    for( var i in this.params ) {
      var param = this.params[i];

      for( var j in param.names ) {
        environment.variables[param.names[j].name] = {
          index: index,
          type: this.params[i].type,
          set: function(expression) {
            return module.local.set( this.index, expression );
          },
          get: function() {
            return module.local.get( this.index, param.type.binaryen() );
          }          
        };
        
	var name = param.names[j].name;
        params.push( name );
        inputs.push( param.type.binaryen() );
        index = index + 1;
      }
    }
    
    var result = Binaryen.none;
    if (this.resultType)
      result = this.resultType.binaryen();

    var locals = [];
    
    this.block.vars.forEach( function(v) {
      for (var i in v.names) {
        environment.variables[v.names[j].name] = {
          index: index,
          type: v.type,
          set: function(expression) {
            return module.local.set( this.index, expression );
          },
          get: function() {
            return module.local.get( this.index, v.type.binaryen() );
          }          
        };
        
        locals.push( v.type.binaryen() );
        index = index + 1;
      }
    });

    var functionType = module.addFunctionType(null, result, inputs);
    
    var code = this.block.generate(environment);
    
    module.addFunction(this.identifier.name, functionType, locals, code);
    
    return;
    
    
    if (this.resultType) {
      environment.functionIdentifier = this.identifier;
    }

    var id = this.identifier.generate(environment);
    
    //code = code + `function ${id}(${params.join(',')}) {\n`;
    //code = code + `trace("${id}");\n`;

    for( var i in this.params ) {
      var param = this.params[i];

      for( var j in param.names ) {
	if (param.type.name == "memoryword") {
	  var n = param.names[j].name;
	  //code = code + `/*BADBAD*/var ${n}_int = new Int32Array(${n}.buffer);\n`;      

	  //code = code + `var ${n}_gr = new Float32Array(${n}.buffer);\n`;
	  //code = code + `var ${n}_hh = new Uint16Array(${n}.buffer);\n`;
	  //code = code + `var ${n}_qqqq = new Uint8Array(${n}.buffer);`;	  
	  
	}
      }
    }

    if (this.resultType) {
      code = code + `var _${id}; /* has result type ${this.resultType.generate(environment)} */\n`;
    }
    
    code = code + this.block.generate(environment);

    //code = code + `trace_exit("${id}");\n`;
    
    if (this.resultType) {
      code = code + `return _${id};\n`;
    }
    code = code + "}\n";
    
    var iii = module.addFunctionType('iii', Binaryen.i32, [Binaryen.i32, Binaryen.i32]);
    module.addFunction(this.identifier, iii, locals, ret);
    
    if (this.resultType) {
      environment.functionIdentifier = undefined;
    }
    
    return code;
  }
  
};

