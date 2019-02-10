'use strict';

module.exports = class Desig {
  constructor(target, desig) {
    this.target = target;
    this.desig = desig;
  }

  generate(environment) {
    // Split a desig into individual desigs

    if (this.target.generate == undefined) {
      console.log("mising=",this.target);
    }
      
    
    this.target.generate(environment);
    var variable = this.target.variable;
    var type = environment.resolveType( this.target.type );
    var module = environment.module;
    
    // Handle arrays
    if (type.componentType) {
      var index = this.desig.generate( environment );

      var base = module.i32.mul( module.i32.const( type.componentType.bytes() ),
                                 module.i32.sub( index,
                                                 module.i32.const( type.index.lower.number ) ) );
      this.variable = variable.rebase( type.componentType, base );
      this.type = type.componentType;
      return this.variable.get();
    }

    if (type.fields) {
      var offset = 0;
      
      for( var i in type.fields ) {
        var f = type.fields[i];

        if (f.variants) {
          var maxOffset = 0;
          for( var m in f.variants ) {
            var localOffset = 0;
            for( var j in f.variants[m].fields ) {
              var field = f.variants[m].fields[j];
              for( var n in field.names ) {
                if (field.names[n].name == this.desig.name) {
                  this.variable = variable.rebase( field.type, module.i32.const(offset + localOffset) );
                  this.type = field.type;
                  return this.variable.get();
                }

                localOffset += field.type.bytes();
              }
            }

            if (localOffset > maxOffset)
              maxOffset = localOffset;
          }

          offset += maxOffset;
        }

        if (f.type) {          
          for( var n in f.names ) {
            var name = f.names[n];
            if (name.name == this.desig.name) {
              this.variable = variable.rebase( f.type, module.i32.const(offset) );
              this.type = f.type;
              return this.variable.get();
            }

            offset += f.type.bytes();
          }
        }
      }

      console.log("type=",this.variable.type);
      console.log("DESIG=",this);
      throw `Could not find field ${this.desig.name}`;
    }
    
    this.type = type;
    return variable.get();
    
    /*
    var v = this.variable;
    if (this.variable.referent) v = this.variable.referent;
    var vv = environment.resolveVariable( v );
    var t = environment.resolveType( vv );
    
    var factor = "1";
    var offset = "0";

    var code = this.variable.name;

    var desig = this.desig;

    var theType = vv;
    var index = "0";
    var shift = "0";    
    if (t.componentType) {
      index = desig.shift().generate(environment);
      if (t.index.lower)
        shift = t.index.lower.generate(environment);      
      
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
*/
  }
  
};
