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
      //console.log("FIXME pointer.js",this.type);
      var t = environment.resolveType(this.type);
      this.variable = environment.program.memory.variable( '', t, 0 );
      return this.variable.get();
    }

    throw "Do not know how to create pointers.";
  }
};
