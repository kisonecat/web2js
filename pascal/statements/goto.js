'use strict';
var Binaryen = require('binaryen');

module.exports = class Goto {
  constructor(label) {
    this.label = label;
  }

  gotos() {
    return [this.label];
  }
  
  generate(environment){
    var module = environment.module;
    
    var label = environment.resolveLabel( this.label );

    if (label) {
      return label.generate( environment );
    }

    var e = environment;
    while (e !== undefined && e.name === undefined) {
      e = e.parent;
    }

    if (e)
      throw `Could not find label ${this.label} in ${e.name}`;
    else
      throw `Could not find label ${this.label} in main`;
    
    return module.return();
  }
};
