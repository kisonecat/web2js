'use strict';

module.exports = class Desig {
  constructor(variable, desig) {
    this.variable = variable;
    this.desig = desig;
  }

  generate(block) {
    var v = block.resolveVariable( this.variable );

    var desig = this.desig;

    var factor = 1;
    var offset = 0;

    return this.variable.generate(block);
    
    // Handle arrays of twohalves in a special way
    if (v.type && v.type.componentType && v.type.componentType.name == "twohalves") {
      if (desig.length == 1) {
        desig.push( "int" );
      }

      desig.push(desig.shift());

      if (desig.length == 2) {
        if (desig[0].toString() == "lh") {
          factor = 2; offset = 0;
          desig.shift();
          desig.unshift("hh");            
        }
        else if (desig[0].toString() == "rh") {
          factor = 2; offset = 1;
          desig.shift();
          desig.unshift("hh");
        }
      }
    }
    else
    // Handle arrays of memorywords in a special way
    if (v.type && v.type.componentType && v.type.componentType.name == "memoryword") {
      if (desig.length == 1) {
        desig.push( "int" );
      }

      desig.push(desig.shift());
      
      if (desig.length == 3) {
        if (desig[0].toString() == "hh") {
          if (desig[1].toString() == "lh") {
            factor = 2; offset = 0;
            desig.shift();
            desig.shift();
            desig.unshift("hh");            
          }
          else if (desig[1].toString() == "rh") {
            factor = 2; offset = 1;
            desig.shift();
            desig.shift();
            desig.unshift("hh");
          }
          else if (desig[1].toString() == "b0") {
            factor = 4; offset = 0;
            desig.shift();
            desig.shift();
            desig.unshift("qqqq");
          }
          else if (desig[1].toString() == "b1") {
            factor = 4; offset = 1;
            desig.shift();
            desig.shift();
            desig.unshift("qqqq");              
          }            
        }
        else if (desig[0].toString() == "qqqq") {
          if (desig[1].toString() == "b0") {
            factor = 4; offset = 0;
            desig.shift();
          }
          else if (desig[1].toString() == "b1") {
            factor = 4; offset = 1;
            desig.shift();
          }            
          else if (desig[1].toString() == "b2") {
            factor = 4; offset = 2;
            desig.shift();
          }            
          else if (desig[1].toString() == "b3") {
            factor = 4; offset = 3;
            desig.shift();
          }            
        }
      }
    }
    else
    if (v.type && v.type.componentType) {
      desig.push(desig.shift());      
    }
    
    var code = this.variable;
    
    for(var i in desig) {
      var d = desig[i];
      if (d.index !== undefined) {
        if (v.type && v.type.componentType)
          if (v.type.index.lower) {
            code = code + `[${factor}*((${d.generate(block)})-(${v.type.index.lower}))+${offset}]`;
          } else {
            var indexingType = block.resolveType(v.type.index);
            if (indexingType.lower)
              code = code + `[${factor}*((${d.generate(block)})-(${indexingType.lower}))+${offset}]`;
            else
              code = code + `[${factor}*((${d.generate(block)}))+${offset}]`;         
          }
        else
          code = code + `[${d.generate(block)}]`;
      } else {
        code = code + `.${d.generate(block)}`;
      }
    }
    
    return code;    
  }
  
};
