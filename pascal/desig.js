'use strict';

module.exports = class Desig {
  constructor(variable, desig) {
    this.variable = variable;
    this.desig = desig;
  }

  toString() {
    // BADBAD need to fix offset

    var code = this.variable;
    
    for(var i in this.desig) {
      var d = this.desig[i];
      if (d.index !== undefined) {
        code = code + `[${d}]`;
      } else {
        code = code + `.${d}`;
      }
    }
    
    return code;
  }
};
