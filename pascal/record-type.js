'use strict';

module.exports = class RecordType {
  constructor(fields, packed) {
    this.fields = fields;
    console.log("RECORD=",this.fields);

    if (this.fields[1])
      console.log("first",this.fields[1]);
  }

  initializer(e) {
    return "{}";
  }
  
  generate(e) {
    console.log(this.fields);
    return `record(${this.fields.map( function(t) { if (Array.isArray(t)) return "???"; else return t.generate(e); } ).join(',')})`;
  }

};
