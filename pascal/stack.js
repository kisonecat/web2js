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

module.exports = class Stack {
  constructor(m) {
    this.module = m;
    this.module.addGlobal( "stack", Binaryen.i32, true, this.module.i32.const(65535) );

    this.offset = 0;
    
    this.i32 = commands( this, 4, this.module.i32.load, this.module.i32.store );
    this.u8  = commands( this, 1, this.module.i32.load8_u, this.module.i32.store8 );
    this.s8  = commands( this, 1, this.module.i32.load8_s, this.module.i32.store8 );
    this.s16 = commands( this, 2, this.module.i32.load16_s, this.module.i32.store16_s );                
    this.u16 = commands( this, 2, this.module.i32.load16_u, this.module.i32.store16_u );
    this.f32 = commands( this, 4, this.module.f32.load, this.module.f32.store );
    this.f64 = commands( this, 8, this.module.f64.load, this.module.f64.store );
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


