'use strict';

var Desig = require('../desig');

module.exports = class Assignment {
  constructor(lhs,rhs) {
    this.lhs = lhs;
    this.rhs = rhs;
  }

  gotos() {
    return [];
  }
  
  generate(environment) {
    var lhs, rhs;
    var code = "";

    var v = undefined;
    if (this.lhs.name) {
      v = environment.resolveVariable( this.lhs );
    }

    // Trying to assign to an array?
    if (this.lhs.variable == undefined && v && v.componentType && v.componentType.name == "char") {
      lhs = this.lhs.generate(environment);
      var i = this.lhs.generate(environment) + "_i";
      var range = v.index.range(environment);
      rhs = this.rhs.generate(environment);
      code = code + `for(var ${i}=0; ${i} < ${range}; ${i}++ ) {\n`;
      code = code + `  if (${rhs}[${i}])\n`;      
      code = code + `    ${lhs}[${i}] = ${rhs}[${i}].charCodeAt(0);\n`;
      code = code + `  else\n`;
      code = code + `    ${lhs}[${i}] = 0;\n`;
      code = code + `}`;
      return code;
    }
    
    if (this.lhs.variable) {
      v = environment.resolveVariable( this.lhs.variable );
    }

    if (v) {
      var t = environment.resolveType( v );

      var fields = t.fields;
      if (t.componentType && t.componentType.fields)
        fields = t.componentType.fields;
      
      if (fields) {
        var copyAll = true;
        if (this.lhs.desig) {
          copyAll = this.lhs.desig.every( function(d) { return d.name == undefined; } );
        }

        if (v.name == "fourquarters")
          copyAll = false;

        if (v.name == "twohalves")
          copyAll = false;

        if (v.name == "memoryword")
          copyAll = false;                
        
        if (copyAll) {
          for(var i in fields) {
            var f = fields[i];
            for(var j in fields[i].names) {
              var field = fields[i].names[j];
              
              var desigedLhs;
              if (this.lhs.variable == undefined)
                desigedLhs = new Desig( this.lhs, [field] );
              else
                desigedLhs = new Desig( this.lhs.variable, this.lhs.desig.concat( [field] ) );
                                        
              var desigedRhs;
              if (this.rhs.variable == undefined)
                desigedRhs = new Desig( this.rhs, [field] );
              else
                desigedRhs = new Desig( this.rhs.variable, this.rhs.desig.concat( [field] ) );
              console.log(desigedLhs);
              console.log(desigedRhs);              
              code = code + `${desigedLhs.generate(environment)} = ${desigedRhs.generate(environment)};`;
            }
          }
          
          if (code.length > 0) {
            return code;
          }
        }
      }
    }
    
    if (environment.functionIdentifier &&
        this.lhs.name == environment.functionIdentifier.name) {
      lhs = `_${this.lhs.name}`;
    } else {
      lhs = this.lhs.generate(environment);
    }

    rhs = this.rhs.generate(environment);

    return code + `${lhs} = ${rhs};`;
  }
};
