'use strict';
var Binaryen = require('binaryen');
var Environment = require('../environment.js');

module.exports = class Nop {
  constructor() {
  }

  gotos() {
    return [];
  }

  generate(environment) {
    environment = new Environment(environment);
    var m = environment.module;
    return m.nop();
  }
};
