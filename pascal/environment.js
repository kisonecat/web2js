'use strict';

var ArrayType = require('./array-type');
var RecordDeclaration = require('./record-declaration');
var VariantDeclaration = require('./variant-declaration');
var RecordType = require('./record-type');
var binaryen = require('binaryen');

module.exports = class Environment {
  constructor(parent) {
    this.parent = parent;
    if (parent) {
      this.functionIdentifier = parent.functionIdentifier;
      this.program = parent.program;
    }
    
    this.labels = {};
    this.constants = {};
    this.variables = {};
    this.types = {};
    this.functions = {};
    
    this.setVariable = {};
    this.getVariable = {};
    
    if (parent)
      this.module = parent.module;
    else
      this.module = new binaryen.Module();
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

  resolveRecordDeclaration( f ) {
    var self = this;
    if (f.type) {
      var t = self.resolveType(f.type);
      return new RecordDeclaration( f.names, t );
    }

    if (f.variants) {
      return new VariantDeclaration( f.variants.map( function (v){
        return self.resolveType(v);
      } ) );
    }

    throw `Could not resolve record declaration ${f}`;
  }
  
  resolveType( typeIdentifier ) {
    var old = undefined;
    var resolved = typeIdentifier;
    var self = this;
    
    do {
      old = resolved;
      resolved = self.resolveTypeOnce( resolved );
    } while (old != resolved);

    if (resolved.componentType) {
      var component = self.resolveType( resolved.componentType );
      var index = self.resolveType( resolved.index );
      return new ArrayType( index, component );
    }

    if (resolved.fields) {
      return new RecordType(
        resolved.fields.map( function(f) {
          return self.resolveRecordDeclaration(f);
        }),
        resolved.packed );
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

  resolveFunction( c ) {
    var e = this;
    
    while( e ) {
      if (e.functions[c.name])
        return e.functions[c.name];

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
