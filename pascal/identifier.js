'use strict';
var Binaryen = require('binaryen');

module.exports = class Identifier {
  constructor(name) {
    this.name = name;
  }

  minimum() {
    if (this.name == "integer")
      return -2147483647;

    if (this.name == "char")
      return 0;

    if (this.name == "boolean")
      return 0;

    throw `Cannot find mimumum value of ${this.name}`;
  }

  maximum() {
    if (this.name == "integer")
      return 2147483648;

    if (this.name == "char")
      return 255;

    if (this.name == "boolean")
      return 0;

    throw `Cannot find maximum value of ${this.name}`;    
  }

  range(e) {
    if (this.name == "integer")
      throw "Cannot index by integers";

    if (this.name == "char")
      return "256";

    if (this.name == "boolean")
      return "2";

    throw "Cannot index by unknown type";    
  }

  binaryen(e) {
    if (this.name == "integer")
      return Binaryen.i32;

    if (this.name == "char")
      return Binaryen.i32;      

    if (this.name == "boolean")
      return Binaryen.i32;            

    if (this.name == "real")
      return Binaryen.f32;

    throw "Cannot identify binaryen type";
  }

  isInteger() {
    if (this.name == "integer")
      return true;

    return false;
  }
  
  bytes(e) {
    if (this.name == "integer")
      return 4;

    if (this.name == "char")
      return 1;

    if (this.name == "boolean")
      return 1;

    if (this.name == "real")
      return 4;

    if (this.name == "string")
      return 4;

    console.trace();
    
    throw `Cannot determine size of ${this.name}`;
  }

  matches(other) {
    if ((this.name == "integer") && (other.lower && other.upper))
      return true;
    
    if (this.name == other.name)
      return true;

    return false;
  }
  
  generate(environment) {
    var c = environment.resolveConstant(this);

    if (c) {
      this.type = c.type;

      if (c.text) this.text = c.text;
      
      return c.generate(environment);
    }
    
    var v = environment.resolveVariable( this );

    // Could be a function call
    if (v === undefined) {
      var f = environment.resolveFunction( this );
      if (f === undefined) {
        throw `Could not find ${this.name}`;
      }
        
      var e = f.evaluate([]).generate(environment);
      this.type = f.resultType;
      return e;
    }

    this.variable = v;
    this.type = v.type;
    
    return v.get();
  }
};
