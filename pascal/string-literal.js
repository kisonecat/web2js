'use strict';

module.exports = class StringLiteral {
  constructor(text) {
    this.text = text.replace(/^'/,'').replace(/'$/,'').replace(/''/,"'");
  }

  generate() {
    var t = this.text;
    t = t.replace(/\\/g,'\\\\');  
    t = t.replace(/'/g,'\\\'');
    return `'${t}'`;
  }
};
