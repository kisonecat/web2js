'use strict';

module.exports = class Variable {
  constructor(name) {
    this.name = name;
  }

  generate(environment) {
    var v = environment.resolveVariable( this );
    var t = "";

    if (v) t = v.generate(environment);
    
    return `${this.name}/*${t}*/`;
  }
};
