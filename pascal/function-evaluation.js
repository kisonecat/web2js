'use strict';
var Binaryen = require('binaryen');
var Identifier = require('./identifier.js');
var PointerType = require('./pointer-type.js');

module.exports = class FunctionEvaluation {
  constructor(f,xs) {
    this.f = f;
    this.xs = xs;
  }

  generate(environment) {
    var module = environment.module;

    var name = this.f.name;
    
    if (name.toLowerCase() == "trunc") {
      this.type = new Identifier("integer");
      return module.i32.trunc_s.f64(this.xs[0].generate(environment));
    }

    if (name.toLowerCase() == "round") {
      // nearest is actually "roundeven" which is what round is in pascal
      this.type = new Identifier("integer");
      return module.i32.trunc_s.f64(module.f64.nearest(this.xs[0].generate(environment)));
    }

    if (name.toLowerCase() == "chr") {
      this.type = new Identifier("char");
      return this.xs[0].generate(environment);
    }

    if (name.toLowerCase() == "ord") {
      this.type = new Identifier("integer");
      return this.xs[0].generate(environment);
    }    

    if (name.toLowerCase() == "odd") {
      this.type = new Identifier("boolean");
      var n = this.xs[0].generate(environment);
      return module.i32.eq( module.i32.rem_s( n, module.i32.const(2) ), module.i32.const(1) );
    }    
    
    var offset = 0;
    var commands = [];
    var stack = environment.program.stack;

    var theFunction = environment.resolveFunction( this.f );
    if (theFunction === undefined) {
      throw `Could not find function ${this.f.name}`;
    }
    
    this.type = theFunction.resultType;

    var params = environment.resolveFunction( this.f ).params;
    var byReference = [];
    var types = [];
    for( var i in params ) {
      var param = params[i];
      var type = environment.resolveType(param.type);

      if (param.reference)
        type = new PointerType(type);
      
      for( var j in param.names ) {
        byReference.push( param.reference );
        types.push( type );
      }
    }
    
    this.xs.forEach( function(p) {
      var exp = p.generate(environment);
      var type = environment.resolveType( p.type );

      var referenced = byReference.shift();

      if (referenced)
        type = new PointerType(type);
      
      offset += type.bytes();

      if (! type.matches( types.shift() ) ) {
        throw `Type mismatch for ${type} in call to ${name}`;
      }
      
      commands.push( stack.extend( type.bytes() ) );
      stack.shift( type.bytes() );

      exp = p.generate(environment);
      
      if (referenced) {
        var v = stack.variable( null, type, -offset );
        commands.push( v.set( p.variable.pointer() ) );
      } else {
        var v = stack.variable( null, type, -offset );
        commands.push( v.set( exp ) );
      }
    } );

   
    stack.shift( -offset );
    
    if (environment.resolveFunction( this.f ) === undefined) {
      throw `Function ${name} is not defined.`;
    }

    var resultType = Binaryen.none;

    if (this.type !== undefined) {
      resultType = this.type.binaryen();

      if (resultType === undefined) {
        throw `Could not identify binaryen type for ${this.type}`;
      }
    }

    commands.push( module.call( name, [], resultType ) );
    
    if (this.type !== undefined)
      return module.block( null, commands, resultType );
    else
      return module.block( null, commands );      
  }
};
