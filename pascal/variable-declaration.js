'use strict';

module.exports = class VariableDeclaration {
  constructor(names,type) {
    this.names = names;
    this.type = type;
  }

  generate(block) {
    var t = this.type;

    if (this.names.length > 1) {
      var code = "";
      for (var i in this.names) {
        var n = this.names[i];
        code = code + (new VariableDeclaration([n], this.type)).generate(block);
      }
      return code;
    }

    var varName = this.names[0].generate(block);

    var code = `var ${varName}; /* has type ${this.type.generate(block)} */`;

    return code;
    
    if (this.type.componentType && this.type.componentType.name == "memoryword") {
      var code = `var ${varName} = {}; /* has type ${this.type} */\n`;

      var words;
      if (this.type.index.lower)
        //words = `(${this.type.index.upper.generate(block)}) - (${this.type.index.lower.generate(block)})`;
        words = `SOBROKEN`;
      else {
        var indexingType = block.resolveType(this.type.index);
        //words = `(${indexingType.upper.generate(block)}) - (${indexingType.lower.generate(block)})`;
        words = `SOBROKEN`;        
      }

      code = code + `${varName}.int = new Int32Array(${words});\n`;
      code = code + `${varName}.sc = new Int32Array(${varName}.int);\n`;
      code = code + `${varName}.gr = new Float32Array(${varName}.int);\n`;
      code = code + `${varName}.hh = new Int16Array(${varName}.int);\n`;
      code = code + `${varName}.qqqq = new Int8Array(${varName}.int);\n`;

      return code;
    }

    if (this.type.componentType && this.type.componentType.name == "twohalves") {
      var code = `var ${varName} = {}; /* has type ${this.type} */\n`;

      var words;
      if (this.type.index.lower)
        words = `(${this.type.index.upper.generate(block)}) - (${this.type.index.lower.generate(block)})`;
      else {
        var indexingType = block.resolveType(this.type.index);
        words = `(${indexingType.upper.generate(block)}) - (${indexingType.lower.generate(block)})`;        
      }

      code = code + `${varName}.int = new Int32Array(${words});\n`;
      code = code + `${varName}.hh = new Int16Array(${varName}.int);\n`;

      return code;
    }

    if (this.type.componentType) {
      var c = block.resolveType(this.type.componentType);

      var words;
      if (this.type.index.lower)
        //words = `(${this.type.index.upper.generate(block)}) - (${this.type.index.lower.generate(block)})`;
        words = `ALSOBAD`;
      else {
        var indexingType = block.resolveType(this.type.index);
        words = "BROKEN";
        //words = `(${indexingType.upper.generate(block)}) - (${indexingType.lower.generate(block)})`;        
      }

      if (c.fields) {
        var code = `var ${varName} = {}; /* has ${c.fields.length} */\n`;
        var v = varName;
        
        for( var i in c.fields ) {
          var f = c.fields[i];
          f.names.forEach( function(name) {
            code = code + `${v}.${name} = new Int32Array(${words});\n`;
          });
        }
        
        return code;
      }
    }    
    
    t = block.resolveType(t);

    if (t.fileType)
      return `var ${varName} = new FileHandle("${varName}"); /* has type ${this.type} */`;
    
    if ((this.type.name == "integer") || (this.type.name == "halfword"))
      return `var ${varName} = 0; /* has type ${this.type} */`;

    if (this.type.name == "twohalves")
      return `var ${varName} = {rh:0,lh:0}; /* has type ${this.type} */`;

    if (this.type.name == "fourquarters")
      return `var ${varName} = {b0:0,b1:0,b2:0,b3:0}; /* has type ${this.type} */`;    

    if ((this.type.name == "boolean"))
      return `var ${varName} = false; /* has type ${this.type} */`;    

    if (t.index) {
      var index = t.index;
      if (index.lower == undefined)
        index = block.resolveType(index);  

      if (index.name == "char") {
        index = {upper: 255, lower:0};
      }
      
      var intType = "Int32";
      if (t.componentType.name == "char")
        intType = "Uint8";

      if (t.componentType.name == "ASCIIcode")
        intType = "Uint8";

      if (t.componentType.name == "packedASCIIcode")
        intType = "Uint8";            
        
      //var constructor = `new ${intType}Array((${index.upper.generate(block)}) - (${index.lower.generate(block)}));`;
      var constructor = `new ${intType}Array(BAD);`;
      
      return `var ${varName} = ${constructor}; /* has type ${this.type} */`;
    } else {
      if (t.fields) {
        var code = `var ${varName} = {`

        for(var i in t.fields) {
          var f = t.fields[i];
          code = code + f.toString();
        }
        
        code = code + `}; /* has type ${this.type} */`;
        return code;
      } else {
        if ((this.type.name == "integer") ||(this.type.name == "halfword"))
          return `var ${varName}; /* has type ${this.type} */`;
        
        return `var ${varName}; /* has type ${this.type} */`;
      }
    }
  }
};
