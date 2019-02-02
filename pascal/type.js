'use strict';
var Binaryen = require('binaryen');

module.exports = class Type {
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

  bytes(e) {
    if (this.name == "integer")
      return 4;

    if (this.name == "char")
      return 1;

    if (this.name == "boolean")
      return 1;

    if (this.name == "real")
      return 8;

    throw "Cannot find size of type instance in bytes";
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

  intish(e) {
    if (this.name == "integer")
      return "Int32";

    if (this.name == "char")
      return "Uint8";

    if (this.name == "boolean")
      return "Uint8";

    throw "Cannot intish by unknown type";    
  }

  initializer(e) {
    if (this.name == "integer")
      return "0";

    if (this.name == "char")
      return "0";

    if (this.name == "boolean")
      return "false";

    return "undefined";
  }
  
  generate(e) {
    return this.name;
  }
};
