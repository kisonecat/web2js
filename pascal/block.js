'use strict';

var Environment = require('./environment.js');

module.exports = class Block {
  constructor(labels,consts,types,vars,pfs,compound, parent) {
    this.labels = labels;
    this.consts = consts;
    this.types = types;
    this.vars = vars;
    this.pfs = pfs;
    this.compound = compound;
    this.parent = parent;
  }
  
  generate(environment) {
    var code = "";

    environment = new Environment(environment);
    
    this.consts.forEach( function(v) {
      environment.constants[v.name] = v.expression;
    });
    
    this.vars.forEach( function(v) {
      for (var i in v.names) {
        var name = v.names[i].name;
        environment.variables[name] = v.type;
      }
      code = code + v.generate(environment);
      code = code + "\n";      
    });
    
    this.pfs.forEach( function(v) {
      code = code + v.generate(environment);
      code = code + "\n";      
    });

    code = code + this.compound.generate(environment);

    return code;
   }
}
