'use strict';
var Binaryen = require('binaryen');

module.exports = class Goto {
  constructor(label) {
    this.label = label;
  }

  gotos() {
    return [this.label];
  }
  
  generate(environment){
    var module = environment.module;
    
    var label = environment.resolveLabel( this.label );

    if (label) {
      return label.generate( environment );
    }

    if ((this.label == 9999) || (this.label == 9998)) {
      var jmpbuf = 900 * 1024*64;
      var jmpbuf_end = 1000 * 1024*64;
      
      return module.block( null, [ module.i32.store( jmpbuf, 0, module.i32.const(0), module.i32.const(jmpbuf+8) ),
                                   module.i32.store( jmpbuf + 4, 0, module.i32.const(0), module.i32.const(jmpbuf_end) ),
                                   module.call( "start_unwind", [module.i32.const(jmpbuf)], Binaryen.none ),
                                   module.return( module.i32.const(0) ) ] );
      //return module.call( "start_unwind", [module.i32.const(1024)], Binaryen.none );
      //return module.unreachable();
    }

    var e = environment;
    while (e !== undefined && e.name === undefined) {
      e = e.parent;
    }

    if (e)
      throw `Could not find label ${this.label} in ${e.name}`;
    else
      throw `Could not find label ${this.label} in main`;
    
    return module.return();
  }
};
