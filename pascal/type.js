'use strict';

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
