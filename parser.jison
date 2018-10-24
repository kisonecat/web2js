
%token	array begin case const do downto else	end file for function goto if label	of procedure program record repeat then	to type until var while noreturn	others r_num i_num string_literal single_char	assign  undef_id var_id	proc_id proc_param fun_id fun_param const_id	type_id hhb0 hhb1 field_id define field	break

%nonassoc '=' '<>' '<' '>' '<=' '>='
%left '+' '-' or
%right unary_plus unary_minus
%left '*' '/' div mod and
%right not

%start PROGRAM

%%



PROGRAM:
  	DEFS
          PROGRAM_HEAD
  	LABEL_DEC_PART CONST_DEC_PART TYPE_DEC_PART
  	VAR_DEC_PART
  	P_F_DEC_PART
  	BODY
  	  { YYACCEPT; }
          ;

/* The @define statements we use to populate the symbol table.  */
DEFS:
 	  /* empty */
 	| DEFS DEF
 	;
 DEF:
 	  define field undef_id ';'
 	    {
 	      ii = add_to_table (last_id);
 	      sym_table[ii].typ = field_id;
 	    }
 	| define function undef_id ';'
 	    {
 	      ii = add_to_table (last_id);
 	      sym_table[ii].typ = fun_id;
 	    }
 	| define const undef_id ';'
 	    {
 	      ii = add_to_table (last_id);
 	      sym_table[ii].typ = const_id;
 	    }
 	| define function undef_id '(' ')' ';'
 	    {
 	      ii = add_to_table (last_id);
 	      sym_table[ii].typ = fun_param;
 	    }
 	| define procedure undef_id ';'
 	    {
 	      ii = add_to_table (last_id);
 	      sym_table[ii].typ = proc_id;
 	    }
 	| define procedure undef_id '(' ')' ';'
 	    {
 	      ii = add_to_table (last_id);
 	      sym_table[ii].typ = proc_param;
 	    }
 	| define type undef_id ';'
 	    {
 	      ii = add_to_table (last_id);
 	      sym_table[ii].typ = type_id;
 	    }
 	| define type undef_id '=' SUBRANGE_TYPE ';'
 	    {
 	      ii = add_to_table (last_id);
 	      sym_table[ii].typ = type_id;
 	      sym_table[ii].val = lower_bound;
 	      sym_table[ii].val_sym = lower_sym;
 	      sym_table[ii].upper = upper_bound;
 	      sym_table[ii].upper_sym = upper_sym;
 	    }
 	| define var undef_id ';'
 	    {
 	      ii = add_to_table (last_id);
 	      sym_table[ii].typ = var_id;
 	    }
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

BLOCK:
           LABEL_DEC_PART
           CONST_DEC_PART TYPE_DEC_PART
           VAR_DEC_PART
STAT_PART
{ }
 	;

 LABEL_DEC_PART:		/* empty */
         |	label
                 LABEL_LIST ';'
         ;

 LABEL_LIST:		LABEL
         |	LABEL_LIST ',' LABEL
         ;

 LABEL:
 	i_num {  }
 	;

 CONST_DEC_PART:
                 /* empty */
         |	const CONST_DEC_LIST
                         {  }
         ;

 CONST_DEC_LIST:
 	  CONST_DEC
         | CONST_DEC_LIST CONST_DEC
         ;

CONST_ID_DEF: undef_id { yy.sym_table[yytext] = { type: "const_id" }; } ;

 CONST_DEC:
 	CONST_ID_DEF
 	'='		  
         CONSTANT_EXPRESS 
';'		  { }
         ;

CONSTANT:
i_num  { }
         | r_num
         | STRING   
         | CONSTANT_ID
         ;

 CONSTANT_EXPRESS:
 	  UNARY_OP CONSTANT_EXPRESS %prec '*'
             {  }
         | CONSTANT_EXPRESS '+'          
           CONSTANT_EXPRESS              { }
         | CONSTANT_EXPRESS '-'          
           CONSTANT_EXPRESS              { }
         | CONSTANT_EXPRESS '*'          
           CONSTANT_EXPRESS              { }
         | CONSTANT_EXPRESS div      
           CONSTANT_EXPRESS              { }
         | CONSTANT_EXPRESS '='          
           CONSTANT_EXPRESS              { }
         | CONSTANT_EXPRESS '<>'   
           CONSTANT_EXPRESS              { }
         | CONSTANT_EXPRESS mod      
           CONSTANT_EXPRESS              { }
         | CONSTANT_EXPRESS '<'          
           CONSTANT_EXPRESS              { }
         | CONSTANT_EXPRESS '>'          
           CONSTANT_EXPRESS              { }
         | CONSTANT_EXPRESS '<='  
           CONSTANT_EXPRESS              { }
         | CONSTANT_EXPRESS '>=' 
           CONSTANT_EXPRESS              { }
         | CONSTANT_EXPRESS and      
           CONSTANT_EXPRESS              { }
         | CONSTANT_EXPRESS or       
CONSTANT_EXPRESS              { }
         | CONSTANT_EXPRESS '/'          
CONSTANT_EXPRESS              {}
         | CONST_FACTOR { $$ = $1; }
         ;

 CONST_FACTOR:
 	  '('
           CONSTANT_EXPRESS ')'
         | CONSTANT
         ;

 STRING:
 	  string_literal
 	| single_char
 	;

 CONSTANT_ID:
const_id {  }
 	;

 TYPE_DEC_PART:		/* empty */
 		| type TYPE_DEF_LIST
 		;

 TYPE_DEF_LIST:		TYPE_DEF
 		| TYPE_DEF_LIST TYPE_DEF
 		;

 TYPE_DEF:
         TYPE_ID_DEF
         '='
         TYPE ';' {  } 
 	;

TYPE_ID_DEF: undef_id { yy.sym_table[yytext] = { type: "type_id" }; } ;

TYPE:
 	  SIMPLE_TYPE
 	| STRUCTURED_TYPE
 	;

SIMPLE_TYPE:
 	  SUBRANGE_TYPE
         | TYPE_ID
 	;

SUBRANGE_TYPE:
 	SUBRANGE_CONSTANT '..' SUBRANGE_CONSTANT
 	;

// I modified this
 POSSIBLE_PLUS:
 	  /* empty */
 	| unary_plus
	| unary_minus
 	;

 SUBRANGE_CONSTANT:
           POSSIBLE_PLUS i_num
         | POSSIBLE_PLUS const_id
 	| var_id
 	| undef_id
         ;

 TYPE_ID:
 	type_id
 	;

STRUCTURED_TYPE:
 	  ARRAY_TYPE
 	| RECORD_TYPE
 	| FILE_TYPE
 	| POINTER_TYPE
 	;

 POINTER_TYPE:
 	'^' type_id
 	;

 ARRAY_TYPE:
           array '[' INDEX_TYPE ']' of COMPONENT_TYPE
         | array '[' INDEX_TYPE ',' INDEX_TYPE ']' of COMPONENT_TYPE
         ;

 INDEX_TYPE:
 	  SUBRANGE_TYPE
{  }
         | type_id
             {
             }
         ;

 COMPONENT_TYPE: TYPE ;

 RECORD_TYPE:
 	record
         FIELD_LIST end
{  }
         ;

 FIELD_LIST:		RECORD_SECTION
 		| FIELD_LIST ';' RECORD_SECTION
 		;

 RECORD_SECTION: 			FIELD_ID_LIST ':'
 			TYPE
 		| /* empty */
 		;

 FIELD_ID_LIST:		FIELD_ID
 		| FIELD_ID_LIST ',' FIELD_ID
 		;

 FIELD_ID:		undef_id { yy.sym_table[yytext] = { type: "field_id" }; }
 		| field_id
 		;

 FILE_TYPE:
         file of
         TYPE
{  }
 	;

 VAR_DEC_PART:
 	  /* empty */
 	| var VAR_DEC_LIST
 	;

 VAR_DEC_LIST:
 	  VAR_DEC
 	| VAR_DEC_LIST VAR_DEC
 	;

 VAR_DEC:
         VAR_ID_DEC_LIST ':'
         TYPE ';'
{  }
 	;

 VAR_ID_DEC_LIST:	VAR_ID
 		| VAR_ID_DEC_LIST ',' VAR_ID
 		;

VAR_ID:			undef_id { yy.sym_table[yytext] = { type: "var_id" }; } 
		| var_id { yy.sym_table[yytext] = { type: "var_id" }; } 
		| field_id { yy.sym_table[yytext] = { type: "var_id" }; } 
		;

BODY:
	  /* empty */
	| begin
	  STAT_LIST end '.'
	;

P_F_DEC_PART:
	  P_F_DEC
	| P_F_DEC_PART P_F_DEC
	;

P_F_DEC:		PROCEDURE_DEC ';'
		| FUNCTION_DEC ';'
		;

PROCEDURE_DEC:
	PROCEDURE_HEAD BLOCK ;

PROCEDURE:
	  procedure
        | noreturn
	  procedure
	;

PROC_ID_DEF: undef_id { $$ = yytext; } ;

PROCEDURE_HEAD:
	  PROCEDURE PROC_ID_DEF
	  PARAM ';' { if ($3) { yy.sym_table[$2] = { type: "proc_param" }; } else
	   { yy.sym_table[$2] = { type: "proc_id" }; } }
	| procedure DECLARED_PROC
	  PARAM ';'
	;

PARAM:  { $$ = undefined; } |
	'('
	  FORM_PAR_SEC_L ')'
	{ $$ = $2; } ;

FORM_PAR_SEC_L:		FORM_PAR_SEC
		| FORM_PAR_SEC_L ';' FORM_PAR_SEC
		;

FORM_PAR_SEC1:
	  VAR_ID_DEC_LIST ':' type_id
	;

FORM_PAR_SEC:		 FORM_PAR_SEC1
		| var FORM_PAR_SEC1
		;

DECLARED_PROC:
	  proc_id
	| proc_param
	;

FUNCTION_DEC: FUNCTION_HEAD BLOCK ;

FUN_ID_DEF: undef_id { $$ = yytext ; } ;

FUNCTION_HEAD:
	  function undef_id
	  PARAM ':'
          RESULT_TYPE
          ';' { if ($3) { yy.sym_table[$2] = { type: "fun_param" }; } else
	   { yy.sym_table[$2] = { type: "fun_id" }; } }
	| function DECLARED_FUN
          PARAM ':'
          RESULT_TYPE
          ';'
	;

DECLARED_FUN:		fun_id
		| fun_param
		;

RESULT_TYPE:		TYPE
		;

STAT_PART:		begin STAT_LIST end
		;

COMPOUND_STAT:		begin
			STAT_LIST end
		;

STAT_LIST:		STATEMENT
		| STAT_LIST ';' STATEMENT
		;

STATEMENT:		UNLAB_STAT
		| S_LABEL ':'
			UNLAB_STAT
		;

S_LABEL:		i_num
		;

UNLAB_STAT:		SIMPLE_STAT
		| STRUCT_STAT
		;

SIMPLE_STAT:		ASSIGN_STAT
		| PROC_STAT
		| GO_TO_STAT
		| EMPTY_STAT
		| break	
		;

ASSIGN_STAT:		VARIABLE assign
			EXPRESS
		| FUNC_ID_AS assign
			EXPRESS
		;

POINTER: | '^' { };

VARIABLE:	var_id POINTER
		VAR_DESIG_LIST
		| var_id POINTER
		;

FUNC_ID_AS:		fun_id
		| fun_param
		;

VAR_DESIG_LIST:		VAR_DESIG
		| VAR_DESIG_LIST VAR_DESIG
		;

VAR_DESIG:		'['
			EXPRESS VAR_DESIG1
		| '.' field_id
		| '.' var_id		
		| '.' hhb0
		| '.' hhb1
		;

VAR_DESIG1:		']'
		| ','
			EXPRESS	']'
		;

EXPRESS:		UNARY_OP EXPRESS	%prec '*'
				
		| EXPRESS '+'  EXPRESS
		| EXPRESS '-'  EXPRESS
		| EXPRESS '*' EXPRESS
		| EXPRESS div EXPRESS
		| EXPRESS '='  EXPRESS
		| EXPRESS '<>' EXPRESS
		| EXPRESS mod  EXPRESS
		| EXPRESS '<'  EXPRESS
		| EXPRESS '>'  EXPRESS
		| EXPRESS '<=' EXPRESS
		| EXPRESS '>='  EXPRESS
		| EXPRESS and  EXPRESS
		| EXPRESS or  EXPRESS
		| EXPRESS '/'
			EXPRESS
		| FACTOR
		;

UNARY_OP:
	  unary_plus
	| unary_minus
	| not
	;

FACTOR:
	  '('
	  EXPRESS ')'
	| VARIABLE
	| CONSTANT
	| fun_id
	| fun_param
	  PARAM_LIST
	;

PARAM_LIST:
	'('               
	ACTUAL_PARAM_L ')'
	;

ACTUAL_PARAM_L:
	  ACTUAL_PARAM
	| ACTUAL_PARAM_L ',' 
	  ACTUAL_PARAM
	;

ACTUAL_PARAM:
	  EXPRESS WIDTH_FIELD
	| type_id
	;

WIDTH_FIELD:
	  ':' i_num
	| /* empty */
	;

PROC_STAT:		proc_id
		| undef_id
		| break PARAM_LIST
		| proc_param
			PARAM_LIST
		;

GO_TO_STAT:		goto i_num
		;

EMPTY_STAT:		/* empty */
		;

STRUCT_STAT:		COMPOUND_STAT
		| CONDIT_STAT
		| REPETIT_STAT
		;

CONDIT_STAT:		IF_STATEMENT
		| CASE_STATEMENT
		;

IF_STATEMENT:		if
			IF_THEN_ELSE_STAT
		;

IF_THEN_ELSE_STAT:	EXPRESS
			THEN_ELSE_STAT
		;

THEN_ELSE_STAT:		then
			STATEMENT ELSE_STAT
		| then if
			IF_THEN_ELSE_STAT
			ELSE_STAT
		;

ELSE_STAT:		/* empty */
		| else
			STATEMENT
		;

CASE_STATEMENT:		case
			EXPRESS of
			CASE_EL_LIST END_CASE
		;

CASE_EL_LIST:		CASE_ELEMENT
		| CASE_EL_LIST ';' CASE_ELEMENT
		;

CASE_ELEMENT:		CASE_LAB_LIST ':' UNLAB_STAT
		;

CASE_LAB_LIST:		CASE_LAB
		| CASE_LAB_LIST ',' CASE_LAB
		;

CASE_LAB:		i_num
		| others
		;

END_CASE:		end
		| ';' end
		;

REPETIT_STAT:		WHILE_STATEMENT
		| REP_STATEMENT
		| FOR_STATEMENT
		;

WHILE_STATEMENT:	while
			EXPRESS
			do STATEMENT
		;

REP_STATEMENT:		repeat
			STAT_LIST until
			EXPRESS
		;

FOR_STATEMENT:		for
			CONTROL_VAR assign
			FOR_LIST do
			STATEMENT
		;

CONTROL_VAR:		var_id
		;

FOR_LIST:		EXPRESS
			to
			EXPRESS
		| EXPRESS
			downto
			EXPRESS
		;

