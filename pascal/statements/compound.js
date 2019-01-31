'use strict';
var Environment = require('../environment.js');
var Binaryen = require('binaryen');

var trampoline = 1;
var targets = 1;

module.exports = class Compound {
  constructor(statements) {
    this.statements = statements;
  }

  gotos() {
    var g = [];
    this.statements.forEach( function(f) {
      g = g.concat(f.gotos());
    });
    return g;
  }
  
  generate(environment) {
    environment = new Environment(environment);    
    var module = environment.module;

    var labelCount = 0;

    var labels = [];
    var target = {};
    this.statements.forEach( function(v) {
      if (v.label && v.statement) {
        labelCount = labelCount + 1;
        labels.push( v.label );
        target[v.label] = `target${targets}`;
        targets++;
      }
    });

    if (labelCount == 0) {
      var commands = this.statements.map( function(v) {
        return v.generate(environment);
      });
      return module.block (null, commands );
    }

    var trampolineLabel = `trampoline${trampoline}`;
    trampoline = trampoline + 1;

    this.statements.forEach( function(v) {
      if (v.label && v.statement) {
        environment.labels[v.label] = {
          label: trampolineLabel,
          index: labels.indexOf( v.label ),
          generate: function( environment ) {
            var m = environment.module;
            return m.block( null, [
              m.global.set( "trampoline", m.i32.const( this.index ) ),
              m.break( this.label )
            ]);
          }
        };
      }
    });    

    
    var branch = [
      module.if( module.i32.ge_s( module.global.get( "trampoline", Binaryen.i32 ),
                                  module.i32.const( 0 ) ),
                 module.switch( labels.map( function(l) { return target[l]; } ),
                                trampolineLabel,
                                module.global.get( "trampoline", Binaryen.i32 )
                              )
           )
    ];

    this.statements.forEach( function(v) {
      if (v.label) {
        branch = [ module.block( target[v.label], branch ) ];
      }
      
      branch.push( v.generate( environment ) );
    });

    return module.block( null, [
      module.global.set( "trampoline", module.i32.const( -1 ) ),
      module.loop(trampolineLabel, module.block( null, branch ) ) ] );
  }
};


