'use strict';

module.exports = class Environment {
  constructor(parent) {
    this.parent = parent;
    this.labels = {};
    this.constants = {};
    this.variables = {};    
  }   

  resolveLabel( label ) {
    return this.labels[label];
  }
  
  resolveType( typeIdentifier ) {
    for(var i in this.block.types) {
      if (this.block.types[i].name == typeIdentifier.name)
        return this.block.types[i].expression;
    }

    if (this.block.parent)
      return this.block.parent.resolveType( typeIdentifier );
    else
      return typeIdentifier;
  }

  resolveVariable( variableIdentifier ) {
    var e = this;
    
    while( e ) {
      if (e.variables[variableIdentifier.name])
        return e.variables[variableIdentifier.name];

      e = e.parent;
    }

    return undefined;
  }
  
};
