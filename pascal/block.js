'use strict';

module.exports = class Block {
  constructor(labels,consts,types,vars,pfs,compound, parent) {
    this.labels = labels;
    this.consts = consts;
    this.types = types;
    this.vars = vars;
    this.pfs = pfs;
    this.compound = compound;
    this.parent = parent;
  }

  resolveType( typeIdentifier ) {
    for(var i in this.types) {
      if (this.types[i].name == typeIdentifier.name)
        return this.types[i].expression;
    }

    if (this.parent)
      return this.parent.resolveType( typeIdentifier );
    else
      return typeIdentifier;
  }

  resolveVariable( variableIdentifier ) {
    for(var i in this.vars)
      if (this.vars[i].names == variableIdentifier.name)
        return this.vars[i];

    if (this.parent)
      return this.parent.resolveVariable( variableIdentifier );
    else
      return variableIdentifier;
  }
  
  toString() {
    return this.generate(this);
  }
  
  generate(environment) {
    var code = "";
    
    this.consts.forEach( function(v) {
      code = code + v.toString();
      code = code + "\n";
    });
    this.vars.forEach( function(v) {
      code = code + v.generate(environment);
      code = code + "\n";      
    });
    this.pfs.forEach( function(v) {
      code = code + v.generate(environment);
      code = code + "\n";      
    });

    code = code + this.compound.generate(environment);

    return code;
   }
}
