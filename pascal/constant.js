'use strict';

module.exports = class Constant {
  constructor(name) {
    this.name = name;
  }

  generate(environment) {
    var c = environment.resolveConstant(this);

    if (c) {
      this.type = c.type;
      return `${c.generate(environment)}`;
    } else {
      throw `Could not resolve the constant ${this.name}`;
    }
  }
};
