'use strict';
var Binaryen = require('binaryen');
var Environment = require('./environment.js');

module.exports = class Block {
  constructor(labels,consts,types,vars,compound, parent) {
    this.labels = labels;
    this.consts = consts;
    this.types = types;
    this.vars = vars;
    this.compound = compound;
    this.parent = parent;
  }
  
  generate(environment) {
    environment = new Environment(environment);

    this.consts.forEach( function(v) {
      environment.constants[v.name] = v.expression;
    });

    this.types.forEach( function(t) {
      environment.types[t.name] = t.expression;
    });
        
    return this.compound.generate(environment);
   }
}
