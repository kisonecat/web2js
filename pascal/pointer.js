'use strict';

module.exports = class Pointer {
  constructor(referent) {
    this.referent = referent;
  }

  generate(e) {
    return this.referent.generate(e) + ".arrow";
  }
};
