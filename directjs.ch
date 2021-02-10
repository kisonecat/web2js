@x
primitive("input",input,0);@/
@!@:input_}{\.{\\input} primitive@>
@y
primitive("input",input,0);@/
@!@:input_}{\.{\\input} primitive@>
primitive("directjs",input,3);@/
@!@:directjs_}{\.{\\directjs} primitive@>
@z


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



