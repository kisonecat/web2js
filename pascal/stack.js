'use strict';
var Binaryen = require('binaryen');

module.exports = class Stack {
  constructor(m, memory) {
    this.module = m;
    this.memory = memory;
    
    this.module.addGlobal( "stack", Binaryen.i32, true, this.module.i32.const(65535) );

    this.offset = 0;
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

  variable( name, type, offset ) {
    var stack = this;
    var memory = this.memory;
    var module = this.module;
    
    return {
        offset: offset,
        type: type,
        set: function(expression) {
          return memory.byType(this.type).store( this.offset + stack.offset,
                                                 expression,
                                                 module.global.get( "stack", Binaryen.i32 ) );
        },
        get: function() {
          return memory.byType(this.type).load( this.offset + stack.offset,
                                                module.global.get( "stack", Binaryen.i32 ) );
        }          
    };
  }


};


