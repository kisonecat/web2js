'use strict';

var count = 1;

module.exports = class Repeat {
  constructor(expression, statement) {
    this.expression = expression;
    this.statement = statement;
  }

  gotos() {
    return this.statement.gotos();
  }

  generate(environment) {
    var module = environment.module;

    var loopLabel = `repeat${count}`;
    var blockLabel = `repeat${count}-done`;
    count = count + 1;

    var loop = module.block( blockLabel,
                             [ module.loop( loopLabel,
                                            module.block( null, [ this.statement.generate(environment),
                                                                  module.if( this.expression.generate(environment),
                                                                             module.break( blockLabel ),
                                                                             module.break( loopLabel )
                                                                           ) ] )
                                          )
                             ] );

    return loop;
  }
};
