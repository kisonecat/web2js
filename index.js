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
lexer.addRule("break"		, function(lexer) { return 'break'; } );
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

fs.writeFileSync( "tex.wast", module.emitText() );
fs.writeFileSync( "tex.wabt", module.emitBinary() );

// Get the binary in typed array form
var binary = module.emitBinary();
//console.log('binary size: ' + binary.length);
//console.log();

// We don't need the Binaryen module anymore, so we can tell it to
// clean itself up
module.dispose();

var code = new WebAssembly.Module(binary);

var pages = 1;
var memory = new WebAssembly.Memory({initial: pages, maximum: pages});

var library = {
  printString: function(x) {
    var length = new Uint8Array( memory.buffer, x, 1 )[0];
    var buffer = new Uint8Array( memory.buffer, x+1, length );
    var string = String.fromCharCode.apply(null, buffer);
    process.stdout.write(string);
  },
  printBoolean: function(x) {
    if (x)
      process.stdout.write("TRUE");
    else
      process.stdout.write("FALSE");      
  },
  printChar: function(x) {
    process.stdout.write(String.fromCharCode(x));
  },
  printInteger: function(x) {
    process.stdout.write(x.toString());
  },
  printFloat: function(x) {
    process.stdout.write(x.toString());
  },
  printNewline: function(x) {
    process.stdout.write("\n");
  },      
};

// Compile the binary and create an instance
var wasm = new WebAssembly.Instance(code, { library: library,
                                            env: { memory: memory } } );

//console.log("exports: " + Object.keys(wasm.exports).sort().join(","));
//console.log();

// Call the code!
//console.log( wasm.exports );
//console.log('an addition: ' + wasm.exports.adder(40, 2));

//var header = fs.readFileSync("header.js").toString();
//fs.writeFileSync( "tex.js", header + program.generate() );
