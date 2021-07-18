'use strict';
var Binaryen = require('binaryen');

module.exports = class Stack {
  constructor(m, memory) {
    this.module = m;
    this.memory = memory;
    
    this.module.addGlobal( "stack", Binaryen.i32, true, this.module.i32.const(this.memory.pages*65536 - 1) );

    var getType=this.module.addFunctionType(null,Binaryen.i32,[]);

    var getCode = this.module.block(null, [
      this.module.return(
        this.module.global.get( "stack", Binaryen.i32 )
      )
    ]);
    this.module.addFunction("getStackPointer",getType,[],getCode);
    this.module.addFunctionExport("getStackPointer","getStackPointer");

    var setType=this.module.addFunctionType(null,Binaryen.none,[Binaryen.i32]);
    var setCode = this.module.block(null, [
      this.module.global.set( "stack",
                              this.module.local.get( 0, Binaryen.i32 )
                            )
    ]);
    this.module.addFunction("setStackPointer",setType,[],setCode);
    this.module.addFunctionExport("setStackPointer","setStackPointer");
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

  variable( name, type, offset, base ) {
    var stack = this;
    var memory = this.memory;
    var module = this.module;

    if (base === undefined)
      base = module.i32.const(0);    
    
    return {
      offset: offset,
      type: type,
      base: base,      
      set: function(expression) {
        return memory.byType(this.type).store( this.offset,
                                               expression,
                                               module.i32.add( this.base,
                                                               module.local.get( 0, Binaryen.i32 ) ) );
      },
      get: function() {
        return memory.byType(this.type).load( this.offset,
                                              module.i32.add(this.base,
                                                             module.local.get( 0, Binaryen.i32 ) ) );
      },
      rebase: function( type, base ) {
        return stack.variable( this.name, type, this.offset, module.i32.add( this.base, base ) );        
      },

      pointer: function() {
        return module.i32.add( module.i32.const( this.offset ),
                               module.i32.add( this.base, module.local.get( 0, Binaryen.i32 ) ) );
      }

    };
  }


};


