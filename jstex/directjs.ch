@x
else if chr_code=2 then print_esc("scantokens")
@y
else if chr_code=2 then print_esc("scantokens")
else if chr_code=3 then print_esc("directjs")
@z

@x
else if cur_chr=2 then pseudo_start
@y
else if cur_chr=2 then pseudo_start
else if cur_chr=3 then directjs_start
@z

@x
procedure@?pseudo_start; forward;@t\2@>
@y
procedure@?pseudo_start; forward;@t\2@>
procedure@?directjs_start; forward;@t\2@>
@z

@x
@* \[54] System-dependent changes.
@y
@* \[53b] The features of \jsTeX.

@<Generate all \eTeX...@>=
primitive("directjs",input,3);@/
@!@:directjs_}{\.{\\directjs} primitive@>

@ @<Declare \eTeX\ procedures for use by |main_control|@>=
procedure directjs_start;
var old_setting:0..max_selector; {holds |selector| setting}
@!t:str_number; {string to be evaluated}
@!s:str_number; {string to be converted into a pseudo file}
@!l,@!m:pool_pointer; {indices into |str_pool|}
@!p,@!q,@!r:pointer; {for list construction}
@!w: four_quarters; {four ASCII codes}
@!nl,@!sz:integer;
begin
  call_func(scan_toks(false, true));
  t:=tokens_to_string(def_ref);
  delete_token_ref(def_ref);
  evaljs(t,str_pool, str_start, pool_ptr, pool_size, max_strings,buffer,first,last,max_buf_stack,buf_size);
  s := make_string;
@<Convert string |s| into a new pseudo file@>;
flush_str(s);
flush_str(t);
@<Initiate input from new pseudo file@>;
end;

@* \[54] System-dependent changes.
@z
