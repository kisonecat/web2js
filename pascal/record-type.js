'use strict';

module.exports = class RecordType {
  constructor(fields) {
    this.fields = fields;
  }

  initializer(e) {
    return "{}";
  }
  
  generate(e) {
    console.log(this.fields);
    return `record(${this.fields.map( function(t) { if (Array.isArray(t)) return "???"; else return t.generate(e); } ).join(',')})`;
  }

};
