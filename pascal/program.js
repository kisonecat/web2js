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

    for(var j in this.vars) {
      var v = this.vars[j];
      for (var i in v.names) {
        var name = v.names[i].name;
        var type = environment.resolveType( v.type );
        var pointer = this.memorySize;
        this.memorySize += type.bytes();
        
        environment.variables[name] = {
          name: name,
          type: type,
          pointer: module.i32.const(pointer),

          set: function(expression, offset) {
            if (offset === undefined) offset = 0;

            if (this.type.name === "real") {
              if (Binaryen.getExpressionType(expression) == Binaryen.f64)
                return module.f64.store( offset, 0, this.pointer, expression );
              else
                return module.f64.store( offset, 0, this.pointer, module.f64.convert_s.i32 ( expression ) );
            }

            if (this.type.bytes() == 1)
              return module.i32.store8( offset, 0, this.pointer, expression );

            if (this.type.bytes() == 2)
              return module.i32.store16( offset, 0, this.pointer );

            if (this.type.bytes() == 4)
              return module.i32.store( offset, 0, this.pointer, expression );

            return module.nop();
          },
          
          get: function(offset) {
            if (offset === undefined) offset = 0;

            if (this.type.name === "real")
              return module.f64.load( offset, 0, this.pointer );              
            
            if (this.type.bytes() == 1)
              return module.i32.load8_u( offset, 0, this.pointer );

            if (this.type.bytes() == 2)
              return module.i32.load16_s( offset, 0, this.pointer );

            if (this.type.bytes() == 4)
              return module.i32.load( offset, 0, this.pointer );              
          }
        };
      }
    };
    
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

