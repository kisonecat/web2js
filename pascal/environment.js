'use strict';

var ArrayType = require('./array-type');
var RecordDeclaration = require('./record-declaration');
var VariantDeclaration = require('./variant-declaration');
var RecordType = require('./record-type');
var FileType = require('./file-type');
var binaryen = require('binaryen');

module.exports = class Environment {
  constructor(parent, name) {
    this.parent = parent;
    if (parent) {
      this.functionIdentifier = parent.functionIdentifier;
      this.program = parent.program;
    }

    this.name = name;
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
    var e = this;
    
    while( e ) {
      if (e.labels[label])
        return e.labels[label];

      e = e.parent;
    }

    return undefined;
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

    if (resolved.fileType) {
      return new FileType( self.resolveType(resolved.type), resolved.packed );
    }
    
    if (resolved.lower) {
      if ((resolved.lower.name) || (resolved.lower.operator)) {      
        resolved.lower = this.resolveConstant( resolved.lower );
      }
    }

    if (resolved.upper) {
      if ((resolved.upper.name) || (resolved.upper.operator)) {
        resolved.upper = this.resolveConstant( resolved.upper );
      }
    }
    
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

    if (c.operator == '-') {
      c = this.resolveConstant( c.operand );
      c = Object.assign({}, c)
      c.number = c.number * -1;
      return c;
    }
    
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
