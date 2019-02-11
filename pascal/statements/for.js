'use strict';
var Assignment = require('./assignment');
var Operation = require('../operation');
var NumericLiteral = require('../numeric-literal');
var Identifier = require('../identifier');

var count = 1;

module.exports = class For {
  constructor(variable, start, end, skip, statement) {
    this.variable = variable;
    this.start = start;
    this.end = end;
    this.skip = skip;
    this.statement = statement;
  }

  gotos() {
    return this.statement.gotos();
  }
  
  generate(environment) {
    var module = environment.module;
    
    var loopLabel = `for${count}`;
    var blockLabel = `for${count}-done`;
    count = count + 1;

    var end = this.end.generate(environment);

    var assignment = new Assignment( this.variable, this.start );

    var condition = module.nop();
    var increment = module.nop();

    if (this.skip > 0) {
      condition = module.i32.eq( this.variable.generate( environment ), end );
      increment = new Assignment( this.variable, new Operation( "+", this.variable, new NumericLiteral(1, new Identifier("integer")) ) );
    } else {
      condition = module.i32.eq( this.variable.generate( environment ), end );
      increment = new Assignment( this.variable, new Operation( "-", this.variable, new NumericLiteral(1, new Identifier("integer")) ) );      
    }
    
    var loop = module.block( blockLabel,
                             [ assignment.generate(environment),
                               module.loop( loopLabel,
                                            module.block( null, [ this.statement.generate(environment),
                                                                  module.if( condition,
                                                                             module.break( blockLabel ) ),
                                                                  increment.generate( environment ),
                                                                  module.break( loopLabel )
                                                                ] ) )
                                          ] );

    return loop;
  }
};
