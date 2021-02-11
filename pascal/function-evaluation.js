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
      return module.i32.trunc_s.f32(this.xs[0].generate(environment));
    }

    if (name.toLowerCase() == "abs") {
      var x = this.xs[0];
      var e = x.generate(environment);
      
      if (x.type.name == "real") {
        this.type = new Identifier("real");
        return module.f32.abs(e);
      }
      
      if (x.type.isInteger()) {
        this.type = new Identifier("integer");
        return module.if( module.i32.ge_s( e, module.i32.const(0) ),
                          e,
                          module.i32.mul( e, module.i32.const(-1) ) );
      }

      throw "Cannot compute abs."
    }

    if (name.toLowerCase() == "round") {
      // nearest is actually "roundeven" which is what round is in pascal
      this.type = new Identifier("integer");
      return module.i32.trunc_s.f32(module.f32.nearest(this.xs[0].generate(environment)));
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
      // https://en.wikipedia.org/wiki/Modulo_operation#Common_pitfalls
      return module.i32.ne( module.i32.rem_s( n, module.i32.const(2) ), module.i32.const(0) );
    }
    
    if (name.toLowerCase() == "erstat") {
      this.type = new Identifier("integer");

      var file = this.xs[0];

      return module.call( "erstat", [file.generate(environment)],
                          Binaryen.i32 );
    }

    if (name.toLowerCase() == "eoln") {
      this.type = new Identifier("boolean");

      var file = this.xs[0];

      return module.call( "eoln", [file.generate(environment)],
                          Binaryen.i32 );
    }    

    if (name.toLowerCase() == "eof") {
      this.type = new Identifier("boolean");

      var file = this.xs[0];

      return module.call( "eof", [file.generate(environment)],
                          Binaryen.i32 );
    }

    if (name.toLowerCase() == "inputln_actual") {
      this.type = new Identifier("boolean");

      var file = this.xs[0];
      var bypass_eoln = this.xs[1];
      var buffer = this.xs[2];
      var first = this.xs[3];
      var last = this.xs[4];
      var max_buf_stack = this.xs[5];
      var buf_size = this.xs[6];
      
      buffer.generate(environment);
      first.generate(environment);
      last.generate(environment);
      max_buf_stack.generate(environment);
      
      return module.call( "inputln", [file.generate(environment),
                                      bypass_eoln.generate(environment),
                                      buffer.variable.pointer(),
                                      first.variable.pointer(),
                                      last.variable.pointer(),                                      
                                      max_buf_stack.variable.pointer(),
                                      buf_size.generate(environment),
                                     ],
                          Binaryen.i32 );
    }    

    if (name.toLowerCase() == "snapshot") {
      this.type = new Identifier("integer");
      
      return module.call( "snapshot", [], Binaryen.i32 );
    }
    
    if (name.toLowerCase() == "getfilesize") {
      this.type = new Identifier("integer");
      
      var filename = this.xs[0];
      var filenameExp = filename.generate(environment);
      return module.call( "getfilesize", [module.i32.const(filename.type.index.range()),
                                            filename.variable.pointer()],
                            Binaryen.i32 );
    }
    
    var offset = 0;
    var commands = [];
    var stack = environment.program.stack;

    var theFunction = environment.resolveFunction( this.f );
    if (theFunction === undefined) {
      throw `Could not find function ${this.f.name}`;
      //console.log( `Could not find function ${this.f.name}` );
      //this.type = new Identifier("integer");
      //return module.i32.const(17);
    }
    
    this.type = theFunction.resultType;

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

      var referenced = byReference.shift();
      type = environment.resolveType( types.shift() );

      if (! type.matches( environment.resolveType( p.type ) ) ) {
        throw `Type mismatch for ${type} in call to ${name}`;
      }
      
      if (referenced)
        type = new PointerType(type);
      
      commands.push( stack.extend( type.bytes() ) );
      
      exp = p.generate(environment);
      var v = undefined;
      
      if (referenced) {
        v = environment.program.memory.variable( null, type, 0, module.global.get( "stack", Binaryen.i32 ) );
        commands.push( v.set( p.variable.pointer() ) );
      } else {
        v = environment.program.memory.variable( null, type, 0, module.global.get( "stack", Binaryen.i32 ) );
        commands.push( v.set( exp ) );
      }
    } );
    
    if (environment.resolveFunction( this.f ) === undefined) {
      throw `Function ${name} is not defined.`;
    }

    var resultType = Binaryen.none;

    if (this.type !== undefined) {
      var t = environment.resolveType( this.type );      
      resultType = t.binaryen();

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
