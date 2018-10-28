'use strict';

module.exports = class RecordType {
  constructor(fields) {
    this.fields = fields;
  }

  toString() {
    return `record with fields ${this.fields}`;
  }

};
