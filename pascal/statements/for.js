'use strict';
var Assignment = require('./assignment');
var Operation = require('../operation');
var NumericLiteral = require('../numeric-literal');
var Type = require('../type');

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
      condition = module.i32.le_s( this.variable.generate( environment ), end );
      increment = new Assignment( this.variable, new Operation( "+", this.variable, new NumericLiteral(1, new Type("integer")) ) );
    } else {
      condition = module.i32.ge_s( this.variable.generate( environment ), end );
      increment = new Assignment( this.variable, new Operation( "-", this.variable, new NumericLiteral(1, new Type("integer")) ) );      
    }
    
    var loop = module.block( blockLabel,
                             [ assignment.generate(environment),
                               module.loop( loopLabel,
                                            module.if( condition,
                                                       module.block( null, [ this.statement.generate(environment),
                                                                             increment.generate( environment ),
                                                                             module.break( loopLabel ) ] ),
                                                       module.break( blockLabel ) )
                                          ) ] );

    return loop;
  }
};
