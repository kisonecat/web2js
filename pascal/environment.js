'use strict';

var ArrayType = require('./array-type');

module.exports = class Environment {
  constructor(parent) {
    this.parent = parent;
    if (parent)
      this.functionIdentifier = parent.functionIdentifier;
    this.labels = {};
    this.constants = {};
    this.variables = {};
    this.types = {};        
  }   

  resolveLabel( label ) {
    return this.labels[label];
  }
  
  resolveTypeOnce( typeIdentifier ) {
    var e = this;
    
    while( e ) {
      if (e.types[typeIdentifier.name])
        return e.types[typeIdentifier.name];

      e = e.parent;
    }

    return typeIdentifier;
  }

  resolveType( typeIdentifier ) {
    var old = undefined;
    var resolved = typeIdentifier;

    do {
      old = resolved;
      resolved = this.resolveTypeOnce( resolved );
    } while (old != resolved );

    if (resolved.componentType) {
      var component = this.resolveType( resolved.componentType );
      var index = this.resolveType( resolved.index );
      return new ArrayType( index, component );
    }

    return resolved;
  }

  resolveConstant( c ) {
    var e = this;
    
    while( e ) {
      if (e.constants[c.name])
        return e.constants[c.name];

      e = e.parent;
    }

    return undefined;
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
