'use strict';
var Binaryen = require('binaryen');

module.exports = class Identifier {
  constructor(name) {
    this.name = name;
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
      return Binaryen.f64;

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
      return 8;

    var t = e.resolveType( this.name );
    return t.bytes(e);
  }

  matches(other) {
    if (this.name == other.name)
      return true;

    return false;
  }
  
  generate(environment) {
    var c = environment.resolveConstant(this);

    if (c) {
      this.type = c.type;
      return c.generate(environment);
    }
    
    var v = environment.resolveVariable( this );
    this.variable = v;
    this.type = v.type;

    return v.get();
  }
};
