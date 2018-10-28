'use strict';

module.exports = class Nop {
  constructor() {
  }

  gotos() {
    return [];
  }

  
  generate(block) {
    return "/*nop*/;";
  }
};
