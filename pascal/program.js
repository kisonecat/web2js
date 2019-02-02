'use strict';
var Binaryen = require('binaryen');

var Environment = require('./environment.js');

module.exports = class Program {
  constructor(labels,consts,types,vars,pfs,compound, parent) {
    this.labels = labels;
    this.consts = consts;
    this.types = types;
    this.vars = vars;
    this.pfs = pfs;
    this.compound = compound;
    this.parent = parent;
    this.strings = [];
    this.memorySize = 0;
  }

  allocateString( string ) {
    var buffer = Buffer.concat( [Buffer.from([string.length]), Buffer.from(string)] );
    this.strings.push( {offset: this.memorySize, data: buffer} );
    var pointer = this.memorySize;
    this.memorySize += buffer.length;
    return pointer;
  }

  generate(environment) {
    environment = new Environment(environment);
    environment.program = this;
    
    var module = environment.module;
    
    this.consts.forEach( function(v) {
      environment.constants[v.name] = v.expression;
    });

    this.types.forEach( function(t) {
      environment.types[t.name] = t.expression;
    });
    
    this.vars.forEach( function(v) {
      for (var i in v.names) {
        var name = v.names[i].name;
        var type = environment.resolveType( v.type );

        //type.bytes()
        
        environment.variables[name] = {
          name: name,
          type: type,
          
          set: function(expression) {
            if (Binaryen.getExpressionType( expression ) == this.type.binaryen())
              return module.global.set( this.name, expression );
            else {
              if ((Binaryen.getExpressionType( expression ) === Binaryen.f64) && (this.type.binaryen() === Binaryen.i32)) {
                return module.global.set( this.name, module.i32.trunc_s.f64( expression ) );
              }
              if ((Binaryen.getExpressionType( expression ) === Binaryen.i32) && (this.type.binaryen() === Binaryen.f64)) {
                return module.global.set( this.name, module.f64.convert_s.i32( expression ) );
              }
            }
            return module.nop();
          },
          
          get: function() {
            return module.global.get( this.name, this.type.binaryen() );
          }
        };

        if (type.binaryen() == Binaryen.i32)
          module.addGlobal( name, type.binaryen(), true, module.i32.const(0) );
        else
          module.addGlobal( name, type.binaryen(), true, module.f64.const(0) );
      }
    });
    
    this.pfs.forEach( function(v) {
      v.generate(environment);
    });

    module.addGlobal( "trampoline", Binaryen.i32, true, module.i32.const(-1) );
    
    var e = this.compound.generate(environment);
    
    var f = module.addFunctionType('main_type', Binaryen.none, []);
    var main = module.addFunction("main", f, [], e);
    module.setStart(main);

    module.addFunctionImport( "printInteger", "library", "printInteger", module.addFunctionType(null, Binaryen.none, [Binaryen.i32] ) );
    module.addFunctionImport( "printBoolean", "library", "printBoolean", module.addFunctionType(null, Binaryen.none, [Binaryen.i32] ) );    
    module.addFunctionImport( "printChar", "library", "printChar", module.addFunctionType(null, Binaryen.none, [Binaryen.i32] ) );    
    module.addFunctionImport( "printString", "library", "printString", module.addFunctionType(null, Binaryen.none, [Binaryen.i32] ) );
    module.addFunctionImport( "printFloat", "library", "printFloat", module.addFunctionType(null, Binaryen.none, [Binaryen.f64] ) );
    module.addFunctionImport( "printNewline", "library", "printNewline", module.addFunctionType(null, Binaryen.none, [] ) );        

    var pages = Math.ceil(this.memorySize / 65536);
    // FIXME: should compute this
    pages = 1;
    module.addMemoryImport( "0", "env", "memory" );
    module.setMemory(pages, pages, "0", this.strings.map ( function(s) {
      return {offset: module.i32.const(s.offset), data: s.data};
    }));
    
    return module;
   }
};

