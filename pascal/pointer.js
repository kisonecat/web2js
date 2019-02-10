'use strict';

module.exports = class Pointer {
  constructor(referent) {
    this.referent = referent;
  }

  generate(environment) {
    var module = environment.module;
    
    var r = this.referent.generate(environment);
    
    this.type = this.referent.type;

    if (this.type.fileType) {
      this.type = this.type.type;
    }

    console.log("FIXME pointer.js");
    
    return module.i32.const(65);
  }
};
