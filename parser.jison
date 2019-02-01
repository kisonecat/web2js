
%token	array begin case const do downto else	end file for function goto if label	of procedure program record repeat then	to type until var while noreturn	others r_num i_num string_literal single_char	assign  undef_id var_id	proc_id proc_param fun_id fun_param const_id	type_id hhb0 hhb1 field_id define field	break forward

%nonassoc '=' '<>' '<' '>' '<=' '>='
%left '+' '-' or
%right unary_plus unary_minus
%left '*' '/' div mod and
%right not

%start PROGRAM

%{

var Program = require('./pascal/program.js');
var Block = require('./pascal/block.js');
var ConstantDeclaration = require('./pascal/constant-declaration.js');
var TypeDeclaration = require('./pascal/type-declaration.js');
var VariableDeclaration = require('./pascal/variable-declaration.js');
var RecordDeclaration = require('./pascal/record-declaration.js');
var Constant = require('./pascal/constant.js');
var Variable = require('./pascal/variable.js');
var Type = require('./pascal/type.js');
var Pointer = require('./pascal/pointer.js');
var Desig = require('./pascal/desig.js');
var SubrangeType = require('./pascal/subrange-type.js');
var PointerType = require('./pascal/pointer-type.js');
var ArrayType = require('./pascal/array-type.js');
var RecordType = require('./pascal/record-type.js');
var FileType = require('./pascal/file-type.js');
var FieldIdentifier = require('./pascal/field-identifier.js');
var ArrayIndex = require('./pascal/array-index.js');
var FunctionIdentifier = require('./pascal/function-identifier.js');
var FunctionDeclaration = require('./pascal/function-declaration.js');
var ProcedureIdentifier = require('./pascal/procedure-identifier.js');
var Operation = require('./pascal/operation.js');
var UnaryOperation = require('./pascal/unary-operation.js');
var StringLiteral = require('./pascal/string-literal.js');
var NumericLiteral = require('./pascal/numeric-literal.js');
var SingleCharacter = require('./pascal/single-character.js');
var FunctionEvaluation = require('./pascal/function-evaluation.js');
var ExpressionWithWidth = require('./pascal/expression-with-width.js');

var LabeledStatement = require('./pascal/statements/labeled-statement.js');
var BreakStatement = require('./pascal/statements/break.js');
var Nop = require('./pascal/statements/nop.js');
var Assignment = require('./pascal/statements/assignment.js');
var Goto = require('./pascal/statements/goto.js');
var Conditional = require('./pascal/statements/conditional.js');
var Switch = require('./pascal/statements/switch.js');
var Case = require('./pascal/statements/case.js');
var While = require('./pascal/statements/while.js');
var Repeat = require('./pascal/statements/repeat.js');
var For = require('./pascal/statements/for.js');
var CallProcedure = require('./pascal/statements/call-procedure.js');
var Compound = require('./pascal/statements/compound.js');

var theProgram = new Block();

%}

%%

PROGRAM:
          PROGRAM_HEAD
  	LABEL_DEC_PART CONST_DEC_PART TYPE_DEC_PART
  	VAR_DEC_PART
  	P_F_DEC_PART
        BODY
        { return new Program($2,$3,$4,$5,$6, new Compound($7)); }
          ;

/* program statement.  Ignore any files.  */
PROGRAM_HEAD:
 	  program undef_id PROGRAM_FILE_PART ';'
 	;

PROGRAM_FILE_PART:
 	  '(' PROGRAM_FILE_LIST ')'
 	| /* empty */
 	;

PROGRAM_FILE_LIST:
 	  PROGRAM_FILE
 	| PROGRAM_FILE_LIST ',' PROGRAM_FILE
 	;

PROGRAM_FILE:
 	  const_id /* input and output are constants */
 	| undef_id
 	;

BLOCK: LABEL_DEC_PART
       CONST_DEC_PART TYPE_DEC_PART
       VAR_DEC_PART
       STAT_PART
       { $$ = new Block($1,$2,$3,$4,new Compound($5), theProgram); }
 	;

 LABEL_DEC_PART:		/* empty */  { $$ = []; }
         |	label
                 LABEL_LIST ';'   { $$ = $2; }
         ;

 LABEL_LIST:		LABEL  { $$ = [$1]; }
         |	LABEL_LIST ',' LABEL  { $$ = $1.concat( $3 ); }
         ;

 LABEL:
 	i_num { $$ = parseInt(yytext); }
 	;

 CONST_DEC_PART:
                 /* empty */ { $$ = []; }
         |	const CONST_DEC_LIST
                         { $$ = $2; }
         ;

 CONST_DEC_LIST:
 	  CONST_DEC { $$ = [$1]; }
         | CONST_DEC_LIST CONST_DEC  { $$ = $1.concat( $2 ); }
         ;

CONST_ID_DEF: undef_id { yy.sym_table[yytext] = { type: "const_id" }; $$ = yytext; } ;

 CONST_DEC:
 	CONST_ID_DEF
 	'='		  
         CONSTANT_EXPRESS 
';'		  { $$ = new ConstantDeclaration( $1, $3 ); }
         ;

CONSTANT:
           i_num  { $$ = new NumericLiteral(parseInt( yytext ), true); }
         | r_num  { $$ = new NumericLiteral(parseFloat( yytext ), false); }
         | STRING     { $$ = $1; }
         | CONSTANT_ID  { $$ = new Constant( $1 ); }
         ;

 CONSTANT_EXPRESS:
 	  UNARY_OP CONSTANT_EXPRESS %prec '*'
             { $$ = new UnaryOperation($1, $2);}
         | CONSTANT_EXPRESS '+'          
           CONSTANT_EXPRESS              { $$ = new Operation('+', $1, $3);}
         | CONSTANT_EXPRESS '-'          
           CONSTANT_EXPRESS              { $$ = new Operation('-', $1, $3);}
         | CONSTANT_EXPRESS '*'          
           CONSTANT_EXPRESS              {$$ = new Operation('*', $1, $3); }
         | CONSTANT_EXPRESS div      
           CONSTANT_EXPRESS              { $$ = new Operation('div', $1, $3);}
         | CONSTANT_EXPRESS '='          
           CONSTANT_EXPRESS              { $$ = new Operation('==', $1, $3);}
         | CONSTANT_EXPRESS '<>'   
           CONSTANT_EXPRESS              {$$ = new Operation('!=', $1, $3); }
         | CONSTANT_EXPRESS mod      
           CONSTANT_EXPRESS              { $$ = new Operation('%', $1, $3);}
         | CONSTANT_EXPRESS '<'          
           CONSTANT_EXPRESS              { $$ = new Operation('<', $1, $3);}
         | CONSTANT_EXPRESS '>'          
           CONSTANT_EXPRESS              { $$ = new Operation('>', $1, $3);}
         | CONSTANT_EXPRESS '<='  
           CONSTANT_EXPRESS              {$$ = new Operation('<=', $1, $3); }
         | CONSTANT_EXPRESS '>=' 
           CONSTANT_EXPRESS              {$$ = new Operation('>=', $1, $3); }
         | CONSTANT_EXPRESS and      
           CONSTANT_EXPRESS              {$$ = new Operation('&&', $1, $3); }
         | CONSTANT_EXPRESS or       
CONSTANT_EXPRESS              { $$ = new Operation('||', $1, $3);}
         | CONSTANT_EXPRESS '/'          
CONSTANT_EXPRESS              {$$ = new Operation('/', $1, $3);}
         | CONST_FACTOR { $$ = $1; }
         ;

 CONST_FACTOR:
 	  '('
           CONSTANT_EXPRESS ')'  { $$ = $2; }
         | CONSTANT   { $$ = $1; }
         ;

 STRING:  string_literal   { $$ = new StringLiteral(yytext); }
 	| single_char      { $$ = new SingleCharacter(yytext); }
 	;

 CONSTANT_ID: const_id { $$ = yytext; }
 	;

 TYPE_DEC_PART:		/* empty */ { $$ = []; }
 		| type TYPE_DEF_LIST { $$ = $2; }
 		;

 TYPE_DEF_LIST:		TYPE_DEF  { $$ = [$1]; }
 		| TYPE_DEF_LIST TYPE_DEF { $$ = $1.concat( $2 ); }
 		;

 TYPE_DEF:
         TYPE_ID_DEF
         '='
         TYPE ';' { $$ = new TypeDeclaration( $1, $3 ); }
 	;

TYPE_ID_DEF: undef_id { yy.sym_table[yytext] = { type: "type_id" }; $$ = $1; } ;

TYPE:
 	  SIMPLE_TYPE     { $$ = $1; }
 	| STRUCTURED_TYPE  { $$ = $1; }
 	;

SIMPLE_TYPE:
 	  SUBRANGE_TYPE   { $$ = $1; }
         | type_id        { $$ = new Type(yytext); }
 	;

SUBRANGE_TYPE:
 	SUBRANGE_CONSTANT '..' SUBRANGE_CONSTANT  { $$ = new SubrangeType($1,$3); }
 	;

// I modified this
 POSSIBLE_PLUS:
 	  /* empty */  { $$ = 1; }
 	| unary_plus   { $$ = 1; }
	| unary_minus { $$ = -1; }
 	;

INTEGER: i_num { $$ = parseInt(yytext); } ;

CONST_ID: const_id { $$ = new Constant( yytext ); } ;

 SUBRANGE_CONSTANT:
           POSSIBLE_PLUS INTEGER { $$ = new NumericLiteral($1 * $2); }
         | POSSIBLE_PLUS CONST_ID { if ($1 == 1) { $$ = $2; } else { $$ = new UnaryOperation( '-', $2 ); } }
 	| var_id   { $$ = new Variable( yytext); }
 	| undef_id { $$ = new Variable( yytext); }
         ;

STRUCTURED_TYPE:
 	  ARRAY_TYPE  { $$ = $1; }
 	| RECORD_TYPE { $$ = $1; }
 	| FILE_TYPE { $$ = $1; }
 	| POINTER_TYPE { $$ = $1; }
 	;

TYPE_ID: type_id { $$ = new Type(yytext); } ;

 POINTER_TYPE:
 	'^' TYPE_ID   { $$ = new PointerType( $2 ); }
 	;

 ARRAY_TYPE:
           array '[' INDEX_TYPE ']' of COMPONENT_TYPE  { $$ = new ArrayType( $3, $6 ); }
         | array '[' INDEX_TYPE ',' INDEX_TYPE ']' of COMPONENT_TYPE
	 { $$ = new ArrayType( [$3,$5], $8 ); }
         ;

 INDEX_TYPE:
 	  SUBRANGE_TYPE { $$ = $1; }
         | TYPE_ID       { $$ = $1; }
         ;

 COMPONENT_TYPE: TYPE { $$= $1; };

 RECORD_TYPE:   record FIELD_LIST end  { $$ = new RecordType( $2 ); }
         ;

FIELD_LIST:		RECORD_SECTION  { if ($1) { $$ = [$1]; } else { $$ = []; } }
 		| FIELD_LIST ';' RECORD_SECTION  { if ($3) { $$ = $1.concat( [$3] ); } else { $$ = $1; } }
 		;

RECORD_SECTION:  FIELD_ID_LIST ':' TYPE { $$ = new RecordDeclaration( $1, $3 ); }
          	| case type_id of RECORD_CASES { $$ = $4; }
 		| /* empty */ { $$ = undefined; }
 		;

RECORD_CASES: RECORD_CASE { $$ = [$1]; }
	      | RECORD_CASES RECORD_CASE { $$ = $1.concat( $2 ); }
	      ;

RECORD_CASE: i_num ':' '(' FIELD_LIST ')' ';' { $$ = $4; } ;

 FIELD_ID_LIST:		FIELD_ID { $$ = [$1]; }
 		| FIELD_ID_LIST ',' FIELD_ID  { $$ = $1.concat( [$3] ); }
 		;

 FIELD_ID:		undef_id { yy.sym_table[yytext] = { type: "field_id" }; $$ = new FieldIdentifier(yytext); }
 		| field_id { $$ = new FieldIdentifier(yytext); }
 		;

 FILE_TYPE:
         file of
         TYPE
{  $$ = new FileType( $3 ); }
 	;

 VAR_DEC_PART:
 	  /* empty */ { $$ = []; }
 	| var VAR_DEC_LIST  { $$ = $2; }
 	;

 VAR_DEC_LIST:
 	  VAR_DEC   { $$ = [$1]; }
 	| VAR_DEC_LIST VAR_DEC  { $$ = $1.concat( [$2] ); }
 	;

 VAR_DEC:
         VAR_ID_DEC_LIST ':'
         TYPE ';'
{  $$ = new VariableDeclaration( $1, $3 ); }
 	;

 VAR_ID_DEC_LIST:	VAR_ID    { $$ = [$1]; }
 		| VAR_ID_DEC_LIST ',' VAR_ID  { $$ = $1.concat( [$3] ); }
 		;

VAR_ID:		  undef_id { yy.sym_table[yytext] = { type: "var_id" }; $$ = new Variable(yytext); } 
		| var_id { yy.sym_table[yytext] = { type: "var_id" }; $$ = new Variable(yytext); } 
		| field_id { yy.sym_table[yytext] = { type: "var_id" }; $$ = new Variable(yytext); } 
		;

BODY:
	  /* empty */ { $$ = []; }
	| begin
	  STAT_LIST end '.' { $$ = $2; }
	;

P_F_DEC_PART: { $$ = []; }
	|  P_F_DEC { $$ = [$1]; }
	| P_F_DEC_PART P_F_DEC  { $$ = $1.concat( [$2] ); }
	;

P_F_DEC: PROCEDURE_DEC ';' { $$ = $1; }
  | FUNCTION_DEC ';' { $$ = $1; }
  ;

PROCEDURE_DEC:
          PROCEDURE_HEAD BLOCK  { $$ = new FunctionDeclaration( $1[0], $1[1], undefined, $2 ); }
 	| PROCEDURE_HEAD forward  { $$ = new FunctionDeclaration( $1[0], $1[1], undefined, null ); }
	;

PROCEDURE:
	  procedure
        | noreturn
	  procedure
	;

PROC_ID_DEF: undef_id { $$ = new ProcedureIdentifier( yytext ); } ;

PROCEDURE_HEAD:
	  PROCEDURE PROC_ID_DEF
	  PARAM ';' { if ($3.length > 0) { yy.sym_table[$2.name] = { type: "proc_param" }; } else
	   { yy.sym_table[$2.name] = { type: "proc_id" }; }  $$ = [$2, $3]; }
	| procedure DECLARED_PROC
	  PARAM ';'   { $$ = [$2, $3]; }
	;

PARAM:  { $$ = []; } |
	'('
	  FORM_PAR_SEC_L ')'
	{ $$ = $2; } ;

FORM_PAR_SEC_L:		FORM_PAR_SEC  { $$ = [$1]; }
		| FORM_PAR_SEC_L ';' FORM_PAR_SEC  { $$ = $1.concat( [$3] ); }
		;

FORM_PAR_SEC1:  VAR_ID_DEC_LIST ':' TYPE_ID  {  $$ = new VariableDeclaration( $1, $3 ); }
	;

FORM_PAR_SEC:	FORM_PAR_SEC1 { $$ = $1; }
		| var FORM_PAR_SEC1  { $$ = $2; }
		;

DECLARED_PROC:
	  proc_id { $$ = new ProcedureIdentifier( yytext ); }
	| proc_param  { $$ = new ProcedureIdentifier( yytext ); }
	;

FUNCTION_DEC: FUNCTION_HEAD BLOCK { $$ = new FunctionDeclaration( $1[0], $1[1], $1[2], $2 ); }
  | FUNCTION_HEAD forward { $$ = new FunctionDeclaration( $1[0], $1[1], $1[2], null ); }
  ;

FUN_ID_DEF: undef_id { $$ = new FunctionIdentifier( yytext ); } ;

FUNCTION_HEAD:
	  function FUN_ID_DEF
	  PARAM ':'
          RESULT_TYPE
          ';' { if ($3.length > 0) { yy.sym_table[$2.name] = { type: "fun_param" }; } else
	   { yy.sym_table[$2.name] = { type: "fun_id" }; } $$ = [$2, $3, $5]; }
	| function DECLARED_FUN
          PARAM ':'
          RESULT_TYPE
          ';' { $$ = [$2, $3, $5]; }
	;

DECLARED_FUN:		fun_id  { $$ = new FunctionIdentifier( yytext ); }
		| fun_param   { $$ = new FunctionIdentifier( yytext ); }
		;

RESULT_TYPE:		TYPE { $$ = $1; }
		;

STAT_PART:		begin STAT_LIST end { $$ = $2; }
		;

COMPOUND_STAT:		begin
			STAT_LIST end  { $$ = $2; }
		;

STAT_LIST:		STATEMENT  { $$ = [$1]; }
		| STAT_LIST ';' STATEMENT  { $$ = $1.concat( [$3] ); }
		;

STATEMENT:		UNLAB_STAT { $$ = $1; }
		| S_LABEL ':'
			UNLAB_STAT { $$ = new LabeledStatement( $1, $3 ); }
		;

S_LABEL:	  i_num { $$ = parseInt(yytext); }
		;

UNLAB_STAT:	  SIMPLE_STAT { $$ = $1; }
		| STRUCT_STAT  { $$ = $1; }
		;

SIMPLE_STAT:	  ASSIGN_STAT  { $$ = $1; }
		| PROC_STAT { $$ = $1; }
		| GO_TO_STAT { $$ = $1; }
		| EMPTY_STAT { $$ = $1; }
		| break	{ $$ = new BreakStatement(); }
		;

ASSIGN_STAT:	  VARIABLE assign
		  EXPRESS  { $$ = new Assignment( $1, $3 ); }
		| FUNC_ID_AS assign
		  EXPRESS { $$ = new Assignment( $1, $3 ); }
		;

POINTER: {$$ = false;}
       | '^' { $$ = true;}
       ;

VARP: VAR_ID POINTER { if ($2) { $$ = new Pointer( $1 ); } else { $$ = $1; } } ;

VARIABLE:	VARP VAR_DESIG_LIST { $$ = new Desig( $1, $2 ); }
		| VARP  { $$ = $1; }
		;

FUNC_ID_AS:		fun_id { $$ = new FunctionIdentifier(yytext); }
		| fun_param { $$ = new FunctionIdentifier(yytext); }
		;

VAR_DESIG_LIST:		VAR_DESIG { $$ = [$1]; }
		| VAR_DESIG_LIST VAR_DESIG { $$ = $1.concat( [$2] ); }
		;

VAR_DESIG:		'['
			EXPRESS VAR_DESIG1 { if ($3) { $$ = new ArrayIndex([$2, $3]); } else {$$ = new ArrayIndex($2); } }
		| '.' FIELD_ID { $$ = $2; }
		| '.' VAR_ID { $$ = $2; }	
		;

VAR_DESIG1:		']'  { $$ = false; }
		| ','
			EXPRESS	']' {$$ = $2; }
		;

EXPRESS:		UNARY_OP EXPRESS	%prec '*'
				{ $$ = new UnaryOperation( $1, $2 ); }
		| EXPRESS '+'  EXPRESS
				{ $$ = new Operation( '+', $1, $3 ); }
		| EXPRESS '-'  EXPRESS
				{ $$ = new Operation( '-', $1, $3 ); }
		| EXPRESS '*' EXPRESS
				{ $$ = new Operation( '*', $1, $3 ); }
		| EXPRESS div EXPRESS
				{ $$ = new Operation( 'div', $1, $3 ); }
		| EXPRESS '='  EXPRESS
				{ $$ = new Operation( '==', $1, $3 ); }
		| EXPRESS '<>' EXPRESS
				{ $$ = new Operation( '!=', $1, $3 ); }
		| EXPRESS mod  EXPRESS
				{ $$ = new Operation( '%', $1, $3 ); }
		| EXPRESS '<'  EXPRESS
				{ $$ = new Operation( '<', $1, $3 ); }
		| EXPRESS '>'  EXPRESS
				{ $$ = new Operation( '>', $1, $3 ); }		
		| EXPRESS '<=' EXPRESS
				{ $$ = new Operation( '<=', $1, $3 ); }		
		| EXPRESS '>='  EXPRESS
				{ $$ = new Operation( '>=', $1, $3 ); }
		| EXPRESS and  EXPRESS
				{ $$ = new Operation( '&&', $1, $3 ); }
		| EXPRESS or  EXPRESS
				{ $$ = new Operation( '||', $1, $3 ); }
		| EXPRESS '/'
			EXPRESS
				{ $$ = new Operation( '/', $1, $3 ); }						
		| FACTOR { $$ = $1; }
		;

UNARY_OP:
	  unary_plus { $$ = "+"; }
	| unary_minus { $$ = "-"; }
	| not  { $$ = "!"; }
	;

FUN_ID: fun_id { $$ = new FunctionIdentifier(yytext); }
      | fun_param { $$ = new FunctionIdentifier(yytext); }
      ;
      
FACTOR:
	  '('
	  EXPRESS ')' { $$ = $2; }
	| VARIABLE { $$ = $1; }
	| CONSTANT { $$ = $1; }
	| fun_id  { $$ = new FunctionEvaluation( new FunctionIdentifier($1), [] ); }
	| fun_param
	  PARAM_LIST  { $$ = new FunctionEvaluation(new FunctionIdentifier( $1 ), $2 ); }
	;

PARAM_LIST:
	'(' ACTUAL_PARAM_L ')' { $$ = $2; }
	;

ACTUAL_PARAM_L:
	  ACTUAL_PARAM  { $$ = [$1]; }
	| ACTUAL_PARAM_L ','    
	  ACTUAL_PARAM   { $$ = $1.concat( [$3] ); }
	;

ACTUAL_PARAM:
	  EXPRESS WIDTH_FIELD  { if ($2 === undefined) { $$ = $1; } else { $$ = new ExpressionWithWidth( $1, $2 ); } }
	| TYPE_ID   { $$ = $1; }
	;

WIDTH_FIELD:
	  ':' INTEGER { $$ = $2; }
	| /* empty */ { $$ = undefined; }
	;

PROC_PARAM: proc_param { $$ = new ProcedureIdentifier(yytext); } ;

PROC_STAT:	proc_id { $$ = new CallProcedure( new ProcedureIdentifier( yytext ), [] ); }
  // | undef_id { $$ = new CallProcedure( new ProcedureIdentifier( yytext ), [] ); }
		| break PARAM_LIST { $$ = new CallProcedure( new ProcedureIdentifier( 'break' ), $2 ); }
		| PROC_PARAM
			PARAM_LIST  { $$ = new CallProcedure( $1, $2 ); }
		;

GO_TO_STAT:		goto INTEGER  { $$ = new Goto( $2 ); }
		;

EMPTY_STAT:		/* empty */  { $$ = new Nop(); }
		;

STRUCT_STAT:		COMPOUND_STAT { $$ = new Compound($1); }
		| CONDIT_STAT { $$ = $1; }
		| REPETIT_STAT { $$ = $1; }
		;

CONDIT_STAT:		IF_STATEMENT { $$ = $1; }
		| CASE_STATEMENT { $$ = $1; }
		;

IF_STATEMENT:		if
			IF_THEN_ELSE_STAT { $$ = $2; }
		;

IF_THEN_ELSE_STAT:	EXPRESS
			THEN_ELSE_STAT  { $$ = new Conditional($1, $2[0], $2[1]); }
		;

THEN_ELSE_STAT:		then
			STATEMENT ELSE_STAT  { $$ = [$2,$3]; }
		| then if
			IF_THEN_ELSE_STAT
			ELSE_STAT  { $$ = [$3,$4]; }
		;

ELSE_STAT:		/* empty */ { $$ = undefined; }
		| else
			STATEMENT  { $$ = $2; }
		;

CASE_STATEMENT:		case
			EXPRESS of
			CASE_EL_LIST END_CASE { $$ = new Switch( $2, $4 ); }
		;

CASE_EL_LIST:		CASE_ELEMENT       { $$ = [$1]; }
		| CASE_EL_LIST ';' CASE_ELEMENT  { $$ = $1.concat( [$3] ); }
		;

CASE_ELEMENT:		CASE_LAB_LIST ':' UNLAB_STAT { $$ = new Case($1,$3); }
		;

CASE_LAB_LIST:		CASE_LAB      { $$ = [$1]; }
		| CASE_LAB_LIST ',' CASE_LAB  { $$ = $1.concat([$3]); }
		;

CASE_LAB:		i_num      { $$ = parseInt(yytext); }
		| others  { $$ = true; }
		;

END_CASE:	   end
		| ';' end
		;

REPETIT_STAT:		WHILE_STATEMENT { $$ = $1; }
		| REP_STATEMENT { $$ = $1; }
		| FOR_STATEMENT { $$ = $1; }
		;

WHILE_STATEMENT:	while
			EXPRESS
			do STATEMENT { $$ = new While( $2, $4 ); }
		;

REP_STATEMENT:		repeat
			STAT_LIST until
			EXPRESS { $$ = new Repeat( $4, new Compound($2) ); }
		;

FOR_STATEMENT:		for
			CONTROL_VAR assign
			FOR_LIST do
			STATEMENT  { $$ = new For( $2, $4[0], $4[1], $4[2], $6 ); }
		;

CONTROL_VAR:		var_id { $$ = new Variable(yytext); }
		;

FOR_LIST:		EXPRESS
			to
			EXPRESS  { $$ = [$1,$3,1]; }
		| EXPRESS
			downto
			EXPRESS   { $$ = [$1,$3,-1]; }
		;

