'use strict';

module.exports = class Identifier {
  constructor(name) {
    this.name = name;
  }
  
  generate(environment) {
    var c = environment.resolveConstant(this);

    if (c) {
      this.type = c.type;
      return c.generate(environment);
    }
    
    var v = environment.resolveVariable( this );
    this.type = v.type;
    
    return v.get();
  }
};
