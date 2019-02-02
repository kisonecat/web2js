'use strict';

module.exports = class Desig {
  constructor(variable, desig) {
    this.variable = variable;
    this.desig = desig;
  }

  generate(block) {
    // Split a desig into individual desigs

    var v = this.variable;
    if (this.variable.referent) v = this.variable.referent;
    var vv = block.resolveVariable( v );
    var t = block.resolveType( vv );
    
    var factor = "1";
    var offset = "0";

    //var code = this.variable.generate(block);
    var code = this.variable.name;

    var desig = this.desig;

    var theType = vv;
    var index = "0";
    var shift = "0";    
    if (t.componentType) {
      index = desig.shift().generate(block);
      if (t.index.lower)
        shift = t.index.lower.generate(block);      
      
      t = t.componentType;
      theType = vv.componentType;

    }

    if ((theType.name == "memoryword") || (theType.name == "liststaterecord")) {
      var fields = "_" + desig.map( function(d) { return d.name; } ).join('_');
      if (desig.length == 0) fields = "";

      var auxfield = false;
      if (fields.match(/^_auxfield/)) {
	fields = fields.replace(/^_auxfield/, '');
	var auxfield = true;
      }
      
      if (fields == "_hh") { fields = ""; }
      if (fields == "_qqqq") { fields = ""; }
      if (fields == "_qqqq_b0") { fields = "_qqqq"; factor=4; offset=0; }
      if (fields == "_qqqq_b1") { fields = "_qqqq"; factor=4; offset=1; }
      if (fields == "_qqqq_b2") { fields = "_qqqq"; factor=4; offset=2; }
      if (fields == "_qqqq_b3") { fields = "_qqqq"; factor=4; offset=3; }
      if (fields == "_hh_lh") { fields = "_hh"; factor=2; offset=0; }
      if (fields == "_hh_rh") { fields = "_hh"; factor=2; offset=1; }
      if (fields == "_hh_b0") { fields = "_qqqq"; factor=4; offset=0; }
      if (fields == "_hh_b1") { fields = "_qqqq"; factor=4; offset=1; }

      if (auxfield)
	fields = "_auxfield" + fields;

      return `${code}${fields}[${factor}*((${index})-(${shift}))+${offset}]`;
    }
    
    if (theType.name == "twohalves") {
      var fields = "_" + desig.map( function(d) { return d.name; } ).join('_');
      if (desig.length == 0) fields = "";
      if (fields == "_lh") { fields = "_hh"; factor=2; offset=0;}
      if (fields == "_rh") { fields = "_hh"; factor=2; offset=1;}
      if (fields == "_b0") { fields = "_qqqq"; factor=4; offset=0;}
      if (fields == "_b1") { fields = "_qqqq"; factor=4; offset=1;}      
      
      return `${code}${fields}[${factor}*((${index})-(${shift}))+${offset}]`;
    }

    if (theType.name == "fourquarters") {
      var fields = "_" + desig.map( function(d) { return d.name; } ).join('_');
      if (desig.length == 0) fields = "";
      if (fields == "_b0") { fields = "_qqqq"; factor=4; offset=0;}
      if (fields == "_b1") { fields = "_qqqq"; factor=4; offset=1;}
      if (fields == "_b2") { fields = "_qqqq"; factor=4; offset=2;}
      if (fields == "_b3") { fields = "_qqqq"; factor=4; offset=3;}      
      
      return `${code}${fields}[${factor}*((${index})-(${shift}))+${offset}]`;
    }

    for(var i in desig) {
      var d = desig[i];
      code = code + `_${d.name}`;
    }

    code = code + `[${factor}*((${index})-(${shift}))+${offset}]`;

    return code;    
  }
  
};
