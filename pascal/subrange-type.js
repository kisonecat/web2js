'use strict';
var Binaryen = require('binaryen');

module.exports = class SubrangeType {
  constructor(lower,upper) {
    this.lower = lower;
    this.upper = upper;
  }

  minimum() {
    return this.lower.number;
  }

  maximum() {
    return this.upper.number;
  }
  
  range(e) {
    return this.maximum() - this.minimum() + 1;
  }

  bytes(e) {
    var min = this.minimum();
    var max = this.maximum();
    
    if ((min == 0) && (max == 255))
      return 1;

    if ((min == -127) && (max == 128))
      return 1;

    if ((min == 0) && (max == 65535))
      return 2;

    if ((min == -32767) && (max == 32768))
      return 2;

    var b = Math.log(this.range(e))/Math.log(256);

    if (b <= 4)
      return 4;
    
    throw 'Subrange too big.'
  }  

  isInteger() {
    return true;
  }

  binaryen() {
    return Binaryen.i32;    
  }
  
  matches(other) {
    if (other.isInteger())
      return true;
    
    if ((this.lower.number == other.lower.number) &&
        (this.upper.number == other.upper.number))
      return true;

    return false;
  }
  
  intish(e) {
    if ((typeof this.upper.number == "number") &&
        (typeof this.lower.number == "number")) {
      var signed = "Uint";
      var r = this.upper.number - this.lower.number;
      if (this.lower.number < 0) {
        r = r * 2;
        signed = "Int";
      }
      
      if (r <= 255)
        return `${signed}8`;
      
      if (r <= 65536)
        return `${signed}16`;
      
      return `${signed}32`;        
    }

    return "Uint32";
  }
  
  initializer(e) {
    return `0`;
  }
  
  generate(e) {
    return `range ${this.lower.generate(e)}..${this.upper.generate(e)}`;
  }
}
