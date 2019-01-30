'use strict';

module.exports = class Case {
  constructor(label, statement) {
    this.label = label;
    this.statement = statement;
  }

  gotos() {
    return this.statement.gotos();
  }
  
  generate(environment, selector) {
    var m = environment.module;

    var condition;

    var isDefault = this.label.some( function(l) { return l === true; } );

    if (isDefault) {
      condition = m.i32.const(1);
    } else {
      var conditions = this.label.map( function (l) {
        return m.i32.eq( selector, m.i32.const(l) );
      });

      condition = conditions.reduceRight( function(acc, current) {
        return m.i32.or( acc, current );
      });
    }

    return [condition, this.statement.generate(environment)];
  }
};
