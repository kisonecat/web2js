var Lexer = require('flex-js');

var lexer = new Lexer();

var sym_table = {};

function def_type(name) {
  sym_table[name] = {type: 'type_id'};
}

var last_token;

var symbols = require('./symbols.json');

for( var key in symbols ) {
  symbols[key].forEach( function(s) {
    if (key == "fun") {
      sym_table[s] = { type: 'fun_param' };
    } else {
      if (key == "proc") {
        sym_table[s] = { type: 'proc_param' };
      } else {
        sym_table[s] = { type: key + '_id' };
      }
    } 
  });
}

def_type('boolean');
def_type('memoryword');
def_type('real');
def_type('integer');
def_type('char');
def_type('twohalves');

// definitions
lexer.addDefinition('DIGIT', /[0-9]/);
lexer.addDefinition('ALPHA', /[a-zA-Z]/);
lexer.addDefinition('ALPHANUM', /([0-9]|[a-zA-z]|_)/);
lexer.addDefinition('IDENTIFIER', /[a-zA-Z]([0-9]|[a-zA-Z]|_)*/ );
lexer.addDefinition('NUMBER', /[0-9]+/);
lexer.addDefinition('SIGN', /(\+|-)/);
lexer.addDefinition('SIGNED', /(\+|-)?[0-9]+/);
lexer.addDefinition('WHITE', /[ \n\t]+/);
lexer.addDefinition('REAL', /([0-9]+\.[0-9]+|[0-9]+\.[0-9]+e(\+|-)?[0-9]+|[0-9]+e(\+|-)?[0-9]+)/);
lexer.addDefinition('COMMENT', /(({[^}]*})|(\(\*([^*]|\*[^)])*\*\)))/);
lexer.addDefinition('W', /([ \n\t]+|packed )+/);
lexer.addDefinition('WW', /([ \n\t]+|(({[^}]*})|(\(\*([^*]|\*[^)])*\*\)))|packed )*/);
lexer.addDefinition('HHB0', /hh([ \n\t]+|(({[^}]*})|(\(\*([^*]|\*[^)])*\*\)))|packed )*\.([ \n\t]+|(({[^}]*})|(\(\*([^*]|\*[^)])*\*\)))|packed )*b0/);
lexer.addDefinition('HHB1', /hh([ \n\t]+|(({[^}]*})|(\(\*([^*]|\*[^)])*\*\)))|packed )*\.([ \n\t]+|(({[^}]*})|(\(\*([^*]|\*[^)])*\*\)))|packed )*b1/);

lexer.addRule('{', function (lexer) {
  while (lexer.input() != '}')
    ;
});

lexer.addRule(/{W}/);

lexer.addRule(/procedure [a-z_]+;[ \n\t]*forward;/);
lexer.addRule(/function [(),:a-z_]+;[ \n\t]*forward;/);

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
lexer.addRule("noreturn"	, function(lexer) { return 'noreturn'; } );
lexer.addRule("not"		, function(lexer) { return 'not'; } );
lexer.addRule("of"		, function(lexer) { return 'of'; } );
lexer.addRule("or"		, function(lexer) { return 'or'; } );
lexer.addRule("procedure"	, function(lexer) { return 'procedure'; } );
lexer.addRule("program"	, function(lexer) { return 'program'; } );
lexer.addRule("record"	, function(lexer) { return 'record'; } );
lexer.addRule("repeat"	, function(lexer) { return 'repeat'; } );
lexer.addRule(/{HHB0}/		, function(lexer) { return 'hhb0'; } );
lexer.addRule(/{HHB1}/		, function(lexer) { return 'hhb1'; } );
lexer.addRule("then"		, function(lexer) { return 'then'; } );
lexer.addRule("to"		, function(lexer) { return 'to'; } );
lexer.addRule("type"		, function(lexer) { return 'type'; } );
lexer.addRule("until"		, function(lexer) { return 'until'; } );
lexer.addRule("var"		, function(lexer) { return 'var'; } );
lexer.addRule("while"		, function(lexer) { return 'while'; } );
lexer.addRule("others"	, function(lexer) { return 'others'; } );

lexer.addRule(/('([^']|'')')/		, function(lexer) { return 'single_char'; } );

lexer.addRule(/('([^']|'')*')/		, function(lexer) { return 'string_literal'; } );

lexer.addRule('+'		, function(lexer) {
  if ((last_token == 'undef_id') ||
      (last_token == 'field_id') ||
      (last_token == 'type_id') ||
      (last_token == 'var_id') ||
      (last_token == 'const_id') ||      
      (last_token == 'i_num') ||
      (last_token == 'hhb1') ||
      (last_token == 'hhb0') ||            
      (last_token == 'r_num') ||
      (last_token == ')') ||
      (last_token == ']'))
    return '+';
  else
    return 'unary_plus';
});

lexer.addRule('-'		, function(lexer) {
 if ((last_token == 'undef_id') ||
      (last_token == 'field_id') ||
      (last_token == 'type_id') ||
     (last_token == 'var_id') ||
     (last_token == 'const_id') ||
      (last_token == 'hhb1') ||
      (last_token == 'hhb0') ||                 
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
 if ((last_token == 'undef_id') ||
      (last_token == 'field_id') ||
      (last_token == 'type_id') ||
      (last_token == 'var_id') ||
     (last_token == 'i_num') ||
      (last_token == 'hhb1') ||
      (last_token == 'hhb0') ||                 
      (last_token == 'const_id') ||           
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
  if (sym_table[lexer.text])
    return sym_table[lexer.text].type;
  else
    return 'undef_id';
} );


lexer.addRule(/./		, function(lexer) { return '..'; } );


var fs = require('fs');
var code = fs.readFileSync("tex.p").toString();
lexer.setSource(code);

var parser = require('./parser').parser;

parser.yy.sym_table = sym_table;

parser.lexer = {
  lex: function () {
    var token = lexer.lex();
    last_token = token;
    this.yytext = lexer.text;
    //console.log(lexer.text,token);
    return token;
    },
  setInput: function (str) {
  }
};

var program = parser.parse();

console.log(program);


