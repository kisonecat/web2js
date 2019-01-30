'use strict';

module.exports = class BreakStatement {
  constructor() {
  }

  gotos() {
    return [];
  }
  
  generate(block) {
    throw "No support for break.";
  }
};
