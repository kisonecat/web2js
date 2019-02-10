'use strict';

module.exports = class RecordType {
  constructor(fields, packed) {
    this.fields = fields;
    this.packed = packed;
  }

  bytes(e) {
    return this.fields
      .map( function(f) { return f.bytes(e); } )
      .reduce(function(a, b) { return a + b; }, 0);
  }

  matches(other) {
    return true;
  }
  
  initializer(e) {
    return "{}";
  }
  
  generate(e) {
    console.log(this.fields);
    return `record(${this.fields.map( function(t) { if (Array.isArray(t)) return "???"; else return t.generate(e); } ).join(',')})`;
  }

};
