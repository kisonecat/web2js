'use strict';

module.exports = class ProcedureDeclaration {
  constructor(identifier, params, block) {
    this.identifier = identifier;
    this.params = params;
    this.block = block;
   }
};

