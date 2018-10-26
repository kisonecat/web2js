'use strict';

module.exports = class Nop {
  constructor() {
  }

  toString() {
    return "/*nop*/;";
  }
};
