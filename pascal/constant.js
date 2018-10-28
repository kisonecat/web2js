'use strict';

module.exports = class Constant {
  constructor(name) {
    this.name = name;
  }

  generate(environment) {
    if (environment.constants[this.name] == undefined) {
      return `${this.name}`;
    } else {
      return `${environment.constants[this.name].generate(environment)}`;
    } 
  }
};
