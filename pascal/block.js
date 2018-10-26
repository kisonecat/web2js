'use strict';

module.exports = class Block {
   constructor(labels,consts,types,vars,statements) {
     this.labels = labels;
     this.consts = consts;
     this.types = types;
     this.vars = vars;
     this.statements = statements;
   }

  toString() {
    var code = "";
    
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

    this.statements.forEach( function(v) {
      code = code + v.toString();
      code = code + "\n";      
    });

    return code;
   }
}
