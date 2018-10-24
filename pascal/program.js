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
     return this.body.toString();
   }
}
