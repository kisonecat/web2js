'use strict';
var Binaryen = require('binaryen');

function commands( memory, bytes, loader, storer ) {
  return {
    width: bytes,
    loader: loader,
    storer: storer,
    memory: memory,

    load: function( offset, base ) {
      var module = this.memory.module;
      return this.loader( offset, 0, base );
    },
    
    store: function( offset, expression, base ) {
      var module = this.memory.module;
      return this.storer( offset, 0, base, expression );
    },
  };
}

module.exports = class Memory {
  constructor(m, pages) {
    this.module = m;
    this.strings = [];
    this.memorySize = 0;
    this.pages = pages;
    
    this.i32 = commands( this, 4, this.module.i32.load, this.module.i32.store );
    this.i64 = commands( this, 4, this.module.i64.load, this.module.i64.store );    
    this.u8  = commands( this, 1, this.module.i32.load8_u, this.module.i32.store8 );
    this.s8  = commands( this, 1, this.module.i32.load8_s, this.module.i32.store8 );
    this.s16 = commands( this, 2, this.module.i32.load16_s, this.module.i32.store16 );
    this.u16 = commands( this, 2, this.module.i32.load16_u, this.module.i32.store16 );
    this.f32 = commands( this, 4, this.module.f32.load, this.module.f32.store );
    this.f64 = commands( this, 8, this.module.f64.load, this.module.f64.store );
    this.none = { load: function() { }, store: function() {} };
  }

  setup() {
    var neededPages = Math.ceil(this.memorySize / 65536);
    var module = this.module;

    if (this.pages < neededPages) {
      throw `Need ${neededPages} of memory`;
    }
    
    module.addMemoryImport( "0", "env", "memory" );
    module.setMemory(this.pages, this.pages, "0", this.strings.map ( function(s) {
      return {offset: module.i32.const(s.offset), data: s.data};
    }));    
  }

  allocateString( string ) {
    var buffer = Buffer.concat( [Buffer.from([string.length]), Buffer.from(string)] );
    this.strings.push( {offset: this.memorySize, data: buffer} );
    var pointer = this.memorySize;
    this.memorySize += buffer.length;
    return pointer;
  }

  dereferencedVariable( name, type, referent, base ) { 
    var memory = this;
    var module = this.module;
    
    if (base === undefined)
      base = module.i32.const(0);

    return {
      name: name,
      type: type,
      base: base,
      referent: referent,
      
      set: function(expression) {
        return memory.byType(this.type).store( 0, expression, module.i32.add( this.referent.get(), this.base ) );
      },
      
      get: function() {
        return memory.byType(this.type).load( 0, module.i32.add( this.referent.get(), this.base ) );
      },
      
      rebase: function( type, base ) {
        return memory.dereferencedVariable( this.name, type, this.referent, module.i32.add( this.base, base ) );
      },

      pointer: function() {
        return referent.get();
      }
    };   
  }
  
  variable( name, type, offset, base ) {
    var memory = this;
    var module = this.module;
    
    if (base === undefined)
      base = module.i32.const(0);

    return {
      name: name,
      offset: offset,
      type: type,
      base: base,
      
      set: function(expression) {
        return memory.byType(this.type).store( this.offset, expression, this.base );
      },
      
      get: function() {
        return memory.byType(this.type).load( this.offset, this.base );
      },
      
      rebase: function( type, base ) {
        return memory.variable( this.name, type, this.offset, module.i32.add( this.base, base ) );
      },

      pointer: function() {
        return module.i32.add( module.i32.const(this.offset), this.base );
      }
    };
  }
  
  allocateVariable( name, type ) {
    // align everything to 4-byte boundaries
    if (this.memorySize % 4 !== 0)
      this.memorySize += 4 - (this.memorySize % 4);
    
    var pointer = this.memorySize;
    this.memorySize += type.bytes();
    var module = this.module;

    return this.variable( name, type, pointer );
  }
  
  byType(type) {
    if (type.fileType) {
      return this.i32;
    }
    
    if (type.lower && type.upper) {
      var min = type.lower.number;
      var max = type.upper.number;

      if ((min == 0) && (max == 255))
        return this.u8;

      if ((min == -127) && (max == 128))
        return this.s8;

      if ((min == 0) && (max == 65535))
        return this.u16;      

      if ((min == -32767) && (max == 32768))
        return this.s16;

      if (type.bytes() <= 4)
        return this.i32;
    }
    
    if (type.name == "integer")
      return this.i32;

    if (type.name == "char")
      return this.u8;

    if (type.name == "boolean")
      return this.u8;

    if (type.name == "real")
      return this.f32;

    if (type.bytes() == 4)
      return this.i32;

    if (type.bytes() == 8)
      return this.i64;  

    if (type.bytes() == 2)
      return this.u16;

    if (type.bytes() == 1)
      return this.u8;
   
    return this.none;
  }


};


