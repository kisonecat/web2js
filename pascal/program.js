'use strict';
var Binaryen = require('binaryen');
var Environment = require('./environment.js');
var Stack = require('./stack.js');
var Memory = require('./memory.js');

module.exports = class Program {
  constructor(labels,consts,types,vars,pfs,compound, parent) {
    this.labels = labels;
    this.consts = consts;
    this.types = types;
    this.vars = vars;
    this.pfs = pfs;
    this.compound = compound;
    this.parent = parent;
    this.memory = undefined;
    this.stack = undefined;
  }

  generate(environment) {
    environment = new Environment(environment);
    environment.program = this;
    
    var module = environment.module;
    this.memory = new Memory(module);
    this.stack = new Stack(module, this.memory);
    
    this.consts.forEach( function(v) {
      environment.constants[v.name] = v.expression;
    });

    this.types.forEach( function(t) {
      environment.types[t.name] = t.expression;
    });

    for(var j in this.vars) {
      var v = this.vars[j];
      for (var i in v.names) {
        var name = v.names[i].name;
        var type = environment.resolveType( v.type );

        environment.variables[name] = this.memory.allocateVariable( name, type );
      }
    };
    
    this.pfs.forEach( function(v) {
      v.generate(environment);
    });

    module.addGlobal( "trampoline", Binaryen.i32, true, module.i32.const(-1) );
    
    var e = this.compound.generate(environment);
    
    var f = module.addFunctionType(null, Binaryen.none, []);
    var main = module.addFunction("main", f, [], e);
    module.setStart(main);

    module.addFunctionImport( "printInteger", "library", "printInteger", module.addFunctionType(null, Binaryen.none, [Binaryen.i32] ) );
    module.addFunctionImport( "printBoolean", "library", "printBoolean", module.addFunctionType(null, Binaryen.none, [Binaryen.i32] ) );    
    module.addFunctionImport( "printChar", "library", "printChar", module.addFunctionType(null, Binaryen.none, [Binaryen.i32] ) );    
    module.addFunctionImport( "printString", "library", "printString", module.addFunctionType(null, Binaryen.none, [Binaryen.i32] ) );
    module.addFunctionImport( "printFloat", "library", "printFloat", module.addFunctionType(null, Binaryen.none, [Binaryen.f64] ) );
    module.addFunctionImport( "printNewline", "library", "printNewline", module.addFunctionType(null, Binaryen.none, [] ) );

    module.addFunctionImport( "reset", "fs", "reset",
                              module.addFunctionType(null, Binaryen.i32, [Binaryen.i32, Binaryen.i32] ) );        

    this.memory.setup();
    
    return module;
   }
};

