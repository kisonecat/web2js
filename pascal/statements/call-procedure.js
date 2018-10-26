'use strict';

module.exports = class CallProcedure {
  constructor(procedure,params) {
    this.procedure = procedure;
    this.params = params;
  }

  toString() {
    return `${this.procedure}(${this.params});`;
  }
};
