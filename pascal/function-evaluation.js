'use strict';
var Binaryen = require('binaryen');
var Type = require('./type.js');

module.exports = class FunctionEvaluation {
  constructor(f,xs) {
    this.f = f;
    this.xs = xs;
  }

  generate(environment) {
    var module = environment.module;

    if (this.f.name.toLowerCase() == "trunc") {
      this.type = new Type("real");
      return module.i32.trunc_s.f64(this.xs[0].generate(environment));
    }

    if (this.f.name.toLowerCase() == "round") {
      // nearest is actually "roundeven" which is what round is in pascal
      this.type = new Type("integer");
      return module.i32.trunc_s.f64(module.f64.nearest(this.xs[0].generate(environment)));
    }

    var offset = 0;
    var commands = [];
    var stack = environment.program.stack;
    
    this.type = environment.resolveFunction( this.f ).resultType;
    
    this.xs.forEach( function(p) {
      var exp = p.generate(environment);
      var type = environment.resolveType( p.type );

      offset += type.bytes();

      commands.push( stack.extend( type.bytes() ) );
      stack.shift( type.bytes() );
      
      exp = p.generate(environment);
      
      commands.push( stack.byType(type).store( -offset, exp ) );
    } );
    
    stack.shift( -offset );
    
    if (environment.resolveFunction( this.f ) === undefined) {
      throw `Function ${this.f.name} is not defined.`;
    }

    var resultType = Binaryen.none;

    if (this.type !== undefined)
      resultType = this.type.binaryen();
    
    commands.push( module.call( this.f.name, [], resultType ) );
    
    if (this.type !== undefined)
      return module.block( null, commands, resultType );
    else
      return module.block( null, commands );      
  }
};
