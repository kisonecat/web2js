'use strict';
var Binaryen = require('binaryen');

var Desig = require('../desig');
var NumericLiteral = require('../numeric-literal');
var SingleCharacter = require('../single-character');

module.exports = class Assignment {
  constructor(lhs,rhs) {
    this.lhs = lhs;
    this.rhs = rhs;
  }

  gotos() {
    return [];
  }
  
  generate(environment) {
    var module = environment.module;

    var rhs = this.rhs.generate(environment);
    var rhsType = environment.resolveType( this.rhs.type );
    var lhs = this.lhs.generate(environment);
    var lhsType = environment.resolveType( this.lhs.type );

    if ((this.rhs.type.name == "string") && (this.lhs.type.componentType)) {
      if (this.rhs.text) {
        var commands = [];
        
        for( var i = 0; i < Math.min( this.rhs.text.length, this.lhs.type.index.range() ); i++ ) {
          var d = new Desig( this.lhs, new NumericLiteral(i + this.lhs.type.index.minimum()) );
          d.generate(environment);
          var c =  new SingleCharacter(this.rhs.text[i]);
          commands.push( d.variable.set( c.generate(environment) ) );
        }

        for( i = Math.min( this.rhs.text.length, this.lhs.type.index.range() ); i < this.lhs.type.index.range(); i++ ) {
          var d = new Desig( this.lhs, new NumericLiteral(i + this.lhs.type.index.minimum()) );
          d.generate(environment);
          var c =  new SingleCharacter("\x00");
          commands.push( d.variable.set( c.generate(environment) ) );          
        }
        
        return module.block( null, commands );
      } else {
        throw 'Only handle assignment of string literal to array.';
      }
    }
    
    if ((this.rhs.type.name == "integer") && (this.lhs.type.name == "real")) {
      return environment.resolveVariable(this.lhs).set(
        module.f64.convert_s.i32(rhs) );      
    }

    return this.lhs.variable.set( rhs );
  }
};
