'use strict';

module.exports = class FieldIdentifier {
  constructor(name) {
    this.name = name;
  }

  generate(environment) {
    return this.name;
  }
};
