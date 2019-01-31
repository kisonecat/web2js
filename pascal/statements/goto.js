'use strict';

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

    if ((this.label == 9999) || (this.label == 9998)) {
      return module.unreachable();
    }

    if (label) {
      return label.generate( environment );
    }

    throw `Could not find label ${this.label}`;
    return module.return();
  }
};
