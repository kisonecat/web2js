'use strict';

module.exports = class RecordDeclaration {
  constructor(names,type) {
    this.names = names;
    this.type = type;
  }

  toString() {
    var definer = "";
    
    if (this.type.index) {
      definer = `[] /* has type ${this.type} */`;
    } else {
      if (this.type.fields) {
        var definer = "{";

        for(var i in this.type.fields) {
          var f = this.type.fields[i];
          definer = definer + f.toString();
        }
        
        definer = definer + `} /* has type ${this.type} */`;
      } else {
        definer = `0 /* has type ${this.type} */`;
      }
    }

    var code = "";
    for (var i in this.names) {
      code = code + `${this.names[i]}: ${definer},\n`;
    }

    return code;
  }
};
