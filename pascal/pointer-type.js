'use strict';
var Binaryen = require('binaryen');

module.exports = class PointerType {
  constructor(referent) {
    this.referent = referent;
  }

  binaryen(e) {
    return Binaryen.i32;
  }

  matches(other) {
    if (other.referent) {
      return this.referent.matches(other.referent);
    }

    return false;
  }

  bytes(e) {
    return 4;
  }
};
