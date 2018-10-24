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
     return this.body.toString();
   }
}
