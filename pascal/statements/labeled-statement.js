'use strict';

module.exports = class LabeledStatement {
  constructor(label, statement) {
    this.label = label;
    this.statement = statement;
  }

  gotos() {
    return this.statement.gotos();
  }
  
  generate(block) {
    block.labels[this.label] = `continue label${this.label}`;

    var code = "{";
    code = code + `label${this.label}: while(true) {\n`;
    code = code + this.statement.generate(block);
    code = code + `break label${this.label}; } }\n`;
    
    return code;
  }
};
