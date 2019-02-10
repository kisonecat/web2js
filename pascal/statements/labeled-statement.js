'use strict';
var Environment = require('../environment.js');

var count = 1;

module.exports = class LabeledStatement {
  constructor(label, statement) {
    this.label = label;
    this.statement = statement;
  }

  gotos() {
    return this.statement.gotos();
  }
  
  generate(environment) {
    environment = new Environment(environment);
    
    var module = environment.module;

    var loopLabel = `goto${count}`;
    count = count + 1;

    environment.labels[ this.label ] = {
      label: loopLabel,
      generate: function(environment) {
        var module = environment.module;
        return module.break( this.label );
      }
    };
    
    return module.loop( loopLabel,
                        this.statement.generate( environment ) );
    
  }
};
