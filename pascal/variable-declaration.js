'use strict';

module.exports = class VariableDeclaration {
  constructor(names,type) {
    this.names = names;
    this.type = type;
    this.reference = false;
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
    
    //var varName = this.names[0].generate(block);
    var varName = this.names[0].name;

    var t = block.resolveType(this.type);

    var code = `var ${varName} = ${t.initializer(block)}; /* has type ${t.generate(block)} */`;
    
    if (t.componentType == undefined && t.fields == undefined)
      return code;

    var theType = this.type;
    var range = 1;
    if (t.componentType) {
      range = t.index.range(block);
      t = t.componentType;
      theType = this.type.componentType;

      if (t.intish)
        code = `var ${varName} = new ${t.intish(block)}Array(${range});`;
    }

    if (theType.name == "alphafile") {
      code = `var ${varName} = [];\n`;
      code = code + `for( var ${varName}_i = 0; ${varName}_i <= ${range}; ${varName}_i++ )\n`;
      code = code + `  ${varName}[${varName}_i] = new FileHandle();\n`;
      return code;      
    }
    
    if (theType.name == "twohalves") {
      code = `var ${varName} = new Uint32Array(${range});\n`;
      code = code + `var ${varName}_hh = new Int16Array(${varName}.buffer);`;
      code = code + `var ${varName}_qqqq = new Uint8Array(${varName}.buffer);`;
      return code;
    }

    if (theType.name == "fourquarters") {    
      code = `var ${varName} = new Uint32Array(${range});\n`;
      code = code + `var ${varName}_qqqq = new Uint8Array(${varName}.buffer);`;
      return code;
    }

    if (theType.name == "memoryword") {        
      code = `var ${varName} = new Uint32Array(${range});\n`;
      code = code + `var ${varName}_int = new Int32Array(${varName}.buffer);\n`;      
      code = code + `var ${varName}_gr = new Float32Array(${varName}.buffer);\n`;
      code = code + `var ${varName}_hh = new Uint16Array(${varName}.buffer);\n`;
      code = code + `var ${varName}_qqqq = new Uint8Array(${varName}.buffer);`;
      return code;
    }
    
    
    if (t.fields) {
      code = "";
      
      for(var i in t.fields) {
        var f = t.fields[i];
        for(var j in t.fields[i].names) {
          var n = t.fields[i].names[j];

          var fieldType = block.resolveType(f.type);

          if (fieldType.fields == undefined) {
            code = code + `var ${varName}_${n.generate(block)} = new ${fieldType.intish(block)}Array(${range});`;
          } else {
            if (f.type.name == "memoryword") {
              code = code + `var ${varName}_${n.generate(block)} = new Uint32Array(${range});\n`;
              code = code + `var ${varName}_${n.generate(block)}_int = new Int32Array(${varName}_${n.generate(block)}.buffer);\n`;              
              code = code + `var ${varName}_${n.generate(block)}_gr = new Float32Array(${varName}_${n.generate(block)}.buffer);\n`;
              code = code + `var ${varName}_${n.generate(block)}_hh = new Int16Array(${varName}_${n.generate(block)}.buffer);\n`;
              code = code + `var ${varName}_${n.generate(block)}_qqqq = new Int8Array(${varName}_${n.generate(block)}.buffer);`;
            } else {
              throw "Records of records are not generally supported.";
            }
          }
        }
      }      
    }
    
    return code;
  }

};
