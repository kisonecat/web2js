'use strict';

module.exports = class Environment {
  constructor(block) {
    this.block = block;
    this.labels = {};
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
    for(var i in this.block.vars)
      if (this.block.vars[i].names == variableIdentifier.name)
        return this.block.vars[i];

    if (this.block.parent)
      return this.block.parent.resolveVariable( variableIdentifier );
    else
      return variableIdentifier;
  }
  
};
