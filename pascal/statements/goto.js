'use strict';

module.exports = class Goto {
  constructor(label) {
    this.label = label;
  }

  gotos() {
    return [this.label];
  }
  
  generate(block){
    var label = block.resolveLabel( this.label );

    if ((this.label == 9999) || (this.label == 9998)) {
      return "process.exit();\n";
    }

    if (label)
      return block.resolveLabel( this.label ) + `/* goto ${this.label} */;`;
    else {
      return `return /* missing goto ${this.label} */;`;      
    }
       
    //return `return /* ${this.label} */;`;
  }
};
