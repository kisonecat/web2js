'use strict';

module.exports = class VariantDeclaration {
  constructor(variants) {
    this.variants = variants;
  }

  bytes(e) {
    return Math.max(...this.variants.map( function(v) {
      return v.bytes(e);
    }));
  }
  
  generate(e) {
  }
};
