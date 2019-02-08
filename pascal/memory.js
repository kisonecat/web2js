'use strict';
var Binaryen = require('binaryen');

function commands( stack, bytes, loader, storer ) {
  return {
    width: bytes,
    loader: loader,
    storer: storer,
    stack: stack,

    load: function( offset ) {
      var module = this.stack.module;
      return this.loader( offset + this.stack.offset, 0,
                          module.global.get( "stack", Binaryen.i32 ) );
    },
    
    store: function( offset, expression ) {
      var module = this.stack.module;

      return this.storer( offset + this.stack.offset, 0,
                          module.global.get( "stack", Binaryen.i32 ),
                          expression );
    },
  };
}

module.exports = class Memory {
  constructor(m) {
    this.module = m;
    this.strings = [];
    this.memorySize = 0;
    
    this.i32 = commands( this, 4, this.module.i32.load, this.module.i32.store );
    this.u8  = commands( this, 1, this.module.i32.load8_u, this.module.i32.store8 );
    this.s8  = commands( this, 1, this.module.i32.load8_s, this.module.i32.store8 );
    this.s16 = commands( this, 2, this.module.i32.load16_s, this.module.i32.store16_s );                
    this.u16 = commands( this, 2, this.module.i32.load16_u, this.module.i32.store16_u );
    this.f32 = commands( this, 4, this.module.f32.load, this.module.f32.store );
    this.f64 = commands( this, 8, this.module.f64.load, this.module.f64.store );
  }

  setup() {
    var pages = Math.ceil(this.memorySize / 65536);
    
    // FIXME: should compute this
    pages = 1;
    this.module.addMemoryImport( "0", "env", "memory" );
    this.module.setMemory(pages, pages, "0", this.strings.map ( function(s) {
      return {offset: this.module.i32.const(s.offset), data: s.data};
    }));    
  }

  allocateString( string ) {
    var buffer = Buffer.concat( [Buffer.from([string.length]), Buffer.from(string)] );
    this.strings.push( {offset: this.memorySize, data: buffer} );
    var pointer = this.memorySize;
    this.memorySize += buffer.length;
    return pointer;
  }

  allocateGlobal( name, type ) {
    var pointer = this.memorySize;    
    this.memorySize += type.bytes();
    var module = this.module;
    
    return {
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

            throw "Could not set variable.";
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

            throw "Could not get variable.";
            return module.nop();
          }
        };
    
  }
  
  byType(type) {
    if (type.name == "integer")
      return this.i32;

    if (type.name == "char")
      return this.u8;

    if (type.name == "boolean")
      return this.u8;

    if (type.name == "real")
      return this.f64;

    throw "Unknown type for stack";
  }

  shift(offset) {
    this.offset = this.offset + offset;
  }
  
  extend(bytes) {
    return this.shrink(-bytes);
  }
  
  shrink(bytes) {
    return this.module.global.set( "stack", 
                            this.module.i32.add( this.module.global.get( "stack", Binaryen.i32 ),
                                                 this.module.i32.const( bytes ) )
                          );
  }

};


