'use strict';

module.exports = class Switch {
  constructor(expression, cases) {
    this.expression = expression;
    this.cases = cases;
  }

  gotos() {
    var g = [];
    this.cases.forEach( function(f) {
      g = g.concat(f.gotos());
    });
    return g;
  }
  
  generate(block) {
    var code;
    if(this.expression.generate)
      code = `switch(${this.expression.generate(block)}) {\n`;
    else
      code = `switch(${this.expression}) {\n`;

    for (var i in this.cases) {
      var c = this.cases[i];

      code = code + c.generate(block) + "\n";
    }

    code = code + "}";
    
    return code;
  }
};
