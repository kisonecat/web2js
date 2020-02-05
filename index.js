var Lexer = require('flex-js');

var lexer = new Lexer();

var last_token;

// definitions
lexer.addDefinition('DIGIT', /[0-9]/);
lexer.addDefinition('ALPHA', /[a-zA-Z]/);
lexer.addDefinition('ALPHANUM', /([0-9]|[a-zA-z]|_)/);
lexer.addDefinition('IDENTIFIER', /[a-zA-Z]([0-9]|[a-zA-Z]|_)*/ );
lexer.addDefinition('NUMBER', /[0-9]+/);
lexer.addDefinition('SIGN', /(\+|-)/);
lexer.addDefinition('SIGNED', /(\+|-)?[0-9]+/);
lexer.addDefinition('REAL', /([0-9]+\.[0-9]+|[0-9]+\.[0-9]+e(\+|-)?[0-9]+|[0-9]+e(\+|-)?[0-9]+)/);
lexer.addDefinition('COMMENT', /(({[^}]*})|(\(\*([^*]|\*[^)])*\*\)))/);
lexer.addDefinition('W', /([ \n\t]+)+/);

lexer.addRule('{', function (lexer) {
  while (lexer.input() != '}')
    ;
});

lexer.addRule(/{W}/);

//lexer.addRule(/procedure [a-z_]+;[ \n\t]*forward;/);
//lexer.addRule(/function [(),:a-z_]+;[ \n\t]*forward;/);

lexer.addRule("packed"		, function(lexer) { return 'packed'; } );
lexer.addRule("forward"		, function(lexer) { return 'forward'; } );
lexer.addRule("and"		, function(lexer) { return 'and'; } );
lexer.addRule("array"		, function(lexer) { return 'array'; } );
lexer.addRule("begin"		, function(lexer) { return 'begin'; } );
lexer.addRule("case"		, function(lexer) { return 'case'; } );
lexer.addRule("const"		, function(lexer) { return 'const'; } );
lexer.addRule("div"		, function(lexer) { return 'div'; } );
lexer.addRule("do"		, function(lexer) { return 'do'; } );
lexer.addRule("downto"	, function(lexer) { return 'downto'; } );
lexer.addRule("else"		, function(lexer) { return 'else'; } );
lexer.addRule("end"		, function(lexer) { return 'end'; } );
lexer.addRule("file"		, function(lexer) { return 'file'; } );
lexer.addRule("for"		, function(lexer) { return 'for'; } );
lexer.addRule("function"	, function(lexer) { return 'function'; } );
lexer.addRule("goto"		, function(lexer) { return 'goto'; } );
lexer.addRule("if"		, function(lexer) { return 'if'; } );
lexer.addRule("label"		, function(lexer) { return 'label'; } );
lexer.addRule("mod"		, function(lexer) { return 'mod'; } );
lexer.addRule("not"		, function(lexer) { return 'not'; } );
lexer.addRule("of"		, function(lexer) { return 'of'; } );
lexer.addRule("or"		, function(lexer) { return 'or'; } );
lexer.addRule("procedure"	, function(lexer) { return 'procedure'; } );
lexer.addRule("program"	, function(lexer) { return 'program'; } );
lexer.addRule("record"	, function(lexer) { return 'record'; } );
lexer.addRule("repeat"	, function(lexer) { return 'repeat'; } );
lexer.addRule("then"		, function(lexer) { return 'then'; } );
lexer.addRule("to"		, function(lexer) { return 'to'; } );
lexer.addRule("type"		, function(lexer) { return 'type'; } );
lexer.addRule("until"		, function(lexer) { return 'until'; } );
lexer.addRule("var"		, function(lexer) { return 'var'; } );
lexer.addRule("while"		, function(lexer) { return 'while'; } );
lexer.addRule("others"	, function(lexer) { return 'others'; } );
lexer.addRule("true"		, function(lexer) { return 'true'; } );
lexer.addRule("false"		, function(lexer) { return 'false'; } );

lexer.addRule(/'([^']|'')'/		, function(lexer) {
  return 'single_char';
});

lexer.addRule(/'([^']|'')+'/		, function(lexer) {
  if ((lexer.text == "''''") || (lexer.text.length == 3)) {
    lexer.reject();
  } else
    return 'string_literal';
});

lexer.addRule('+'		, function(lexer) {
  if ((last_token == 'identifier') ||
      (last_token == 'i_num') ||
      (last_token == 'r_num') ||
      (last_token == ')') ||
      (last_token == ']'))
    return '+';
  else
    return 'unary_plus';
});

lexer.addRule('-'		, function(lexer) {
 if ((last_token == 'identifier') ||
      (last_token == 'i_num') ||
      (last_token == 'r_num') ||
      (last_token == ')') ||
      (last_token == ']'))
   return '-';
  else {
    var c;
    while ( ((c=lexer.input()) == ' ') || (c == "\t") ) {
    }
    lexer.unput(c);
    if (parseInt(c).toString() != c) {
      return 'unary_minus';
    }
    lexer.reject();
  }
});

lexer.addRule(/-?{REAL}/		, function(lexer) { return 'r_num'; } );

lexer.addRule(/-?{NUMBER}/		, function(lexer) {
 if ((last_token == 'identifier') ||
     (last_token == 'i_num') ||
      (last_token == 'r_num') ||
      (last_token == ')') ||
      (last_token == ']'))
   lexer.reject();

  return 'i_num';
} );

lexer.addRule("*"		, function(lexer) { return '*'; } );
lexer.addRule("/"		, function(lexer) { return '/'; } );
lexer.addRule("="		, function(lexer) { return '='; } );
lexer.addRule("<>"		, function(lexer) { return '<>'; } );
lexer.addRule("<"		, function(lexer) { return '<'; } );
lexer.addRule(">"		, function(lexer) { return '>'; } );
lexer.addRule("<="		, function(lexer) { return '<='; } );
lexer.addRule(">="		, function(lexer) { return '>='; } );
lexer.addRule("("		, function(lexer) { return '('; } );
lexer.addRule(")"		, function(lexer) { return ')'; } );
lexer.addRule("["		, function(lexer) { return '['; } );
lexer.addRule("]"		, function(lexer) { return ']'; } );
lexer.addRule(":="		, function(lexer) { return 'assign'; } );
lexer.addRule(".."		, function(lexer) { return '..';} );
lexer.addRule("."		, function(lexer) { return '.'; } );
lexer.addRule(","		, function(lexer) { return ','; } );
lexer.addRule(";"		, function(lexer) { return ';'; } );
lexer.addRule(":"		, function(lexer) { return ':'; } );
lexer.addRule("^"		, function(lexer) { return '^'; } );

lexer.addRule(/{IDENTIFIER}/		, function(lexer) {
  return 'identifier';
} );


lexer.addRule(/./		, function(lexer) { return '..'; } );

var fs = require('fs');
var code = fs.readFileSync(process.argv[2]).toString();
lexer.setSource(code);

var parser = require('./parser').parser;

parser.lexer = {
  lex: function () {
    var token = lexer.lex();
    last_token = token;
    this.yytext = lexer.text;
    //console.log(lexer.text);
    return token;
    },
  setInput: function (str) {
  }
};

var program = parser.parse();

var module = program.generate();

//module.optimize();
//module.runPasses(["optimize-stack-ir","simplify-locals","ssa","dfo","const-hoisting","dce"]);
//module.runPasses(["remove-unused-brs","pick-load-signs","precompute","precompute-propagate","code-pushing","duplicate-function-elimination","inlining-optimizing","dae-optimizing","generate-stack-ir","optimize-stack-ir"]);


//fs.writeFileSync( "tex.wast", module.emitText() );
fs.writeFileSync( "tex.wabt", module.emitBinary() );

// Get the binary in typed array form
var binary = module.emitBinary();
//console.log('binary size: ' + binary.length);
//console.log();

// We don't need the Binaryen module anymore, so we can tell it to
// clean itself up
module.dispose();

var code = new WebAssembly.Module(binary);

var pages = process.env.PAGES ? Number(process.env.PAGES) : 20;
var memory = new WebAssembly.Memory({initial: pages, maximum: pages});

var callstack = [];
var stackstack = [];

var files = [];

var library = {
  printString: function(descriptor, x) {
    var file = (descriptor < 0) ? {stdout:true} : files[descriptor];
    var length = new Uint8Array( memory.buffer, x, 1 )[0];
    var buffer = new Uint8Array( memory.buffer, x+1, length );
    var string = String.fromCharCode.apply(null, buffer);

    if (file.stdout) {
      process.stdout.write(string);
      return;
    }

    fs.writeSync( file.descriptor, string );    
  },
  printBoolean: function(descriptor, x) {
    var file = (descriptor < 0) ? {stdout:true} : files[descriptor];    

    var result = x ? "TRUE" : "FALSE";

    if (file.stdout) {
      process.stdout.write(result);
      return;
    }

    fs.writeSync( file.descriptor, result );    
  },
  printChar: function(descriptor, x) {
    var file = (descriptor < 0) ? {stdout:true} : files[descriptor];        
    if (file.stdout) {
      process.stdout.write(String.fromCharCode(x));
      return;
    }

    var b = Buffer.alloc(1);
    b[0] = x;
    fs.writeSync( file.descriptor, b );
  },
  printInteger: function(descriptor, x) {
    var file = (descriptor < 0) ? {stdout:true} : files[descriptor];            
    if (file.stdout) {
      process.stdout.write(x.toString());
      return;
    }

    fs.writeSync( file.descriptor, x.toString());
  },
  printFloat: function(descriptor, x) {
    var file = (descriptor < 0) ? {stdout:true} : files[descriptor];                
    if (file.stdout) {
      process.stdout.write(x.toString());
      return;
    }

    fs.writeSync( file.descriptor, x.toString());    
  },
  printNewline: function(descriptor, x) {
    var file = (descriptor < 0) ? {stdout:true} : files[descriptor];                    
    if (file.stdout) {
      process.stdout.write("\n");
      return;
    }

    fs.writeSync( file.descriptor, "\n");    
  },

  enterFunction: function(x, stack) {
    callstack.push(program.traces[x]);
    stackstack.push(stack);
    //console.log("enter",program.traces[x]);
  },

  leaveFunction: function(x, stack) {
    callstack.pop();
    var old = stackstack.pop();
    if (old != stack) {
      console.log("stack=",stack,"versus",old);
    }
    //console.log("leave",program.traces[x]);
  },  
};

var inputBuffer = "\nplain\n\\input sample\n";
//var inputBuffer = "\n&plain\n\\input sample\n";
//var inputBuffer = "\nplain\n\\dump";
//var inputBuffer = "\nplain";
//var inputBuffer = "\n&plain";

var filesystemLibrary = {
  reset: function(length, pointer) {
    var buffer = new Uint8Array( memory.buffer, pointer, length );
    var filename = String.fromCharCode.apply(null, buffer);

    //console.log( filename );
    
    filename = filename.replace(/ +$/g,'');
    filename = filename.replace(/^TeXfonts:/,'fonts/');    

    if (filename == 'TeXformats:TEX.POOL')
      filename = process.env.ETEX ? "etex.pool" : "tex.pool"

    if (filename == "TTY:") {
      files.push({ filename: "stdin",
                   stdin: true,
                   position: 0,
                 });
      return files.length - 1;
    }

    files.push({
      filename: filename,
      position: 0,
      descriptor: fs.openSync(filename,'r'),
    });
    
    return files.length - 1;
  },

  rewrite: function(length, pointer) {
    var buffer = new Uint8Array( memory.buffer, pointer, length );
    var filename = String.fromCharCode.apply(null, buffer);    
    
    filename = filename.replace(/ +$/g,'');    
    
    if (filename == "TTY:") {
      files.push({ filename: "stdout",
                   stdout: true
                 });
      return files.length - 1;
    }

    files.push({
      filename: filename,
      position: 0,
      descriptor: fs.openSync(filename,'w')
    });
    
    return files.length - 1;
  },

  close: function(descriptor) {
    var file = files[descriptor];

    if (file.descriptor)
      fs.closeSync( file.descriptor );

    files[descriptor] = {};
  },

  eof: function(descriptor) {
    var file = files[descriptor];
    
    if (file.eof)
      return 1;
    else
      return 0;
  },

  eoln: function(descriptor) {
    var file = files[descriptor];

    if (file.eoln)
      return 1;
    else
      return 0;
  },
    
  get: function(descriptor, pointer, length) {
    var file = files[descriptor];
    
    var buffer = new Uint8Array( memory.buffer );
    
    if (file.stdin) {
      if (file.position >= inputBuffer.length)
	buffer[pointer] = 13;
      else
	buffer[pointer] = inputBuffer[file.position].charCodeAt(0);
    } else {
      if (fs.readSync( file.descriptor, buffer, pointer, length, file.position ) == 0) {
        buffer[pointer] = 0;
        file.eof = true;
        file.eoln = true;
        return;
      }
    }

    file.eoln = false;
    if (buffer[pointer] == 10)
      file.eoln = true;
    if (buffer[pointer] == 13)
      file.eoln = true;

    file.position = file.position + length;
  },

  put: function(descriptor, pointer, length) {
    var file = files[descriptor];
    
    var buffer = new Uint8Array( memory.buffer );

    fs.writeSync( file.descriptor, buffer, pointer, length );
  },

};

// Compile the binary and create an instance
try {
var wasm = new WebAssembly.Instance(code, { library: library,
                                            fs: filesystemLibrary,
                                            env: { memory: memory } } );
} catch (e) {
  console.log(e);
  console.log(callstack);
}
//console.log("exports: " + Object.keys(wasm.exports).sort().join(","));
//console.log();

// Call the code!
//console.log( wasm.exports );
//console.log('an addition: ' + wasm.exports.adder(40, 2));

//var header = fs.readFileSync("header.js").toString();
//fs.writeFileSync( "tex.js", header + program.generate() );
