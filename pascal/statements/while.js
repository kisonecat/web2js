'use strict';

var count = 1;

module.exports = class While {
  constructor(expression, statement) {
    this.expression = expression;
    this.statement = statement;
  }

  gotos() {
    return this.statement.gotos();
  }

  generate(environment) {
    var module = environment.module;

    var loopLabel = `while${count}`;
    var blockLabel = `while${count}-done`;
    count = count + 1;
    
    var loop = module.block( blockLabel,
                             [ module.loop( loopLabel,
                                            module.if( this.expression.generate(environment),
                                                       module.block( null, [ this.statement.generate(environment),
                                                                             module.break( loopLabel ) ] ),
                                                       module.break( blockLabel ) )
                                          ) ] );

    return loop;
  }

};
