'use strict';

module.exports = class BreakStatement {
  constructor() {
  }

  gotos() {
    return [];
  }
  
  generate(block) {
    return "break;";
  }
};
