// person.js
'use strict';



module.exports = class Program {
   constructor(labels,consts,types,vars,pfs,body) {
     this.labels = labels;
     this.consts = consts;
     this.types = types;
     this.vars = vars;
     this.pfs = pfs;
     this.body = body;
   }

  toString() {
    var code  = "";
    
    this.consts.forEach( function(v) {
      code = code + v.toString();
      code = code + "\n";
    });
    this.types.forEach( function(v) {
      code = code + v.toString();
      code = code + "\n";
    });
    this.vars.forEach( function(v) {
      code = code + v.toString();
      code = code + "\n";      
    });

    this.pfs.forEach( function(v) {
      code = code + v.toString();
      code = code + "\n";      
    });

    this.body.forEach( function(v) {
      code = code + v.toString();
      code = code + "\n";      
    });

    return code;
  }
};
