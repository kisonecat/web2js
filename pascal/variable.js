'use strict';

module.exports = class Variable {
  constructor(name) {
    this.name = name;
  }

  generate(environment) {
    var v = environment.resolveVariable( this );
    this.type = v.type;
    
    return v.get();
  }
};
