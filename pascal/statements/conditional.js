'use strict';

module.exports = class Conditional {
  constructor(expression, result, otherwise) {
    this.expression = expression;
    this.result = result;
    this.otherwise = otherwise;    
   }
};
