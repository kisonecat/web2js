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

    var name = this.f.name;
    
    if (name.toLowerCase() == "trunc") {
      this.type = new Type("integer");
      return module.i32.trunc_s.f64(this.xs[0].generate(environment));
    }

    if (name.toLowerCase() == "round") {
      // nearest is actually "roundeven" which is what round is in pascal
      this.type = new Type("integer");
      return module.i32.trunc_s.f64(module.f64.nearest(this.xs[0].generate(environment)));
    }

    if (name.toLowerCase() == "chr") {
      this.type = new Type("char");
      return this.xs[0].generate(environment);
    }

    if (name.toLowerCase() == "ord") {
      this.type = new Type("integer");
      return this.xs[0].generate(environment);
    }    
    
    var offset = 0;
    var commands = [];
    var stack = environment.program.stack;
    
    this.type = environment.resolveFunction( this.f ).resultType;

    var params = environment.resolveFunction( this.f ).params;
    var byReference = [];
    var types = [];
    for( var i in params ) {
      var param = params[i];
      var type = environment.resolveType(param.type);

      for( var j in param.names ) {
        byReference.push( param.reference );
        types.push( type );
      }
    }
    
    this.xs.forEach( function(p) {
      var exp = p.generate(environment);
      var type = environment.resolveType( p.type );
      
      offset += type.bytes();

      if (! type.matches( types.shift() ) ) {
        throw `Type mismatch for ${type} in call to ${name}`;
      }
      
      commands.push( stack.extend( type.bytes() ) );
      stack.shift( type.bytes() );

      /*
      if (byReference.shift()) {
        console.log(p);
      }
      */
      
      exp = p.generate(environment);
      
      commands.push( stack.byType(type).store( -offset, exp ) );
    } );
    
    stack.shift( -offset );
    
    if (environment.resolveFunction( this.f ) === undefined) {
      throw `Function ${name} is not defined.`;
    }

    var resultType = Binaryen.none;

    if (this.type !== undefined)
      resultType = this.type.binaryen();
    
    commands.push( module.call( name, [], resultType ) );
    
    if (this.type !== undefined)
      return module.block( null, commands, resultType );
    else
      return module.block( null, commands );      
  }
};
