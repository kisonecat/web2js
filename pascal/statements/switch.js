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
  
  generate(environment) {
    var m = environment.module;

    var previous = m.nop();

    var selector = this.expression.generate(environment);
    
    for (var i in this.cases.reverse()) {
      var c = this.cases[i].generate(environment, selector);
      var condition = c[0];
      var result = c[1];
      
      previous = m.if( condition, result, previous );
    }

    return previous;
  }
};
