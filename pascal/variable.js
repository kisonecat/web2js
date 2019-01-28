'use strict';

module.exports = class Variable {
  constructor(name) {
    this.name = name;
  }

  generate(environment) {
    var v = environment.resolveVariable( this );
    var t = "";

    if (v) t = v.generate(environment);

    if (v && ((v.name == "memoryword") || (v.name == "twohalves")  || (v.name == "fourquarters")))
      return `/*${t}*/${this.name}[0]`;
    
    return `/*${t}*/${this.name}`;
  }
};
