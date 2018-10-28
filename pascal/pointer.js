'use strict';

module.exports = class Pointer {
  constructor(referent) {
    this.referent = referent;
  }

  generate() {
    return this.referent.toString() + ".arrow";
  }
};
