'use strict';

module.exports = class Assignment {
  constructor(lhs,rhs) {
    this.lhs = lhs;
    this.rhs = rhs;
  }

  gotos() {
    return [];
  }
  
  generate(environment) {
    var lhs, rhs;

    var v = undefined;
    if (this.lhs.name) {
      v = environment.resolveVariable( this.lhs );
    }
    if (this.lhs.variable) {
      v = environment.resolveVariable( this.lhs.variable );
    }

    if (environment.functionIdentifier && this.lhs.name == environment.functionIdentifier.name) {
      lhs = `_${this.lhs.name}`;
    } else {
      lhs = this.lhs.generate(environment);
    }

    rhs = this.rhs.generate(environment);

    return `${lhs} = ${rhs};`;
  }
};
