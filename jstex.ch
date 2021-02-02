% This is jstex.ch, a WEB change file code extending e-TeX,
% to be applied to etex.web in order to define the jsTeX program.

% jsTeX is copyright (C) 2021 by Jim Fowler.

% e-TeX is copyright (C) 1999-2012 by P. Breitenlohner (1994,98 by the NTS
% team); all rights are reserved. Copying of this file is authorized only if
% (1) you are P. Breitenlohner, or if (2) you make absolutely no changes to
% your copy. (Programs such as TIE allow the application of several change
% files to tex.web; the master files tex.web and etex.ch should stay intact.)

% The TeX program is copyright (C) 1982 by D. E. Knuth.
% TeX is a trademark of the American Mathematical Society.
% e-TeX and NTS are trademarks of the NTS group.

@x limbo l.1 - this is jsTeX
% e-TeX is copyright (C) 1999-2012 by P. Breitenlohner (1994,98 by the NTS
% team); all rights are reserved. Copying of this file is authorized only if
% (1) you are P. Breitenlohner, or if (2) you make absolutely no changes to
% your copy. (Programs such as TIE allow the application of several change
% files to tex.web; the master files tex.web and etex.ch should stay intact.)

% See etex_gen.tex for hints on how to install this program.
% And see etripman.tex for details about how to validate it.
@y
% jsTeX is copyright (C) 2021 by Jim Fowler; all rights are reserved.
% Copying of this file is authorized only if (1) you are Jim Fowler,
% or if (2) you make absolutely no changes to your copy. (Programs
% such as TIE allow the application of several change files to
% tex.web; master files tex.web, etex.ch, and jstex.ch should stay
% intact.)
@z

@x
% This program is directly derived from Donald E. Knuth's TeX;
@y
% This program is indirectly derived from Knuth's TeX via e-TeX.
@z

@x
@p function input_ln(var f:alpha_file;@!bypass_eoln:boolean):boolean;
  {inputs the next line or returns |false|}
var last_nonblank:0..buf_size; {|last| with trailing blanks removed}
begin if bypass_eoln then if not eof(f) then get(f);
  {input the first character of the line into |f^|}
last:=first; {cf.\ Matthew 19\thinspace:\thinspace30}
if eof(f) then input_ln:=false
else  begin last_nonblank:=first;
  while not eoln(f) do
    begin if last>=max_buf_stack then
      begin max_buf_stack:=last+1;
      if max_buf_stack=buf_size then
        @<Report overflow of the input buffer, and abort@>;
      end;
    buffer[last]:=xord[f^]; get(f); incr(last);
    if buffer[last-1]<>" " then last_nonblank:=last;
    end;
  last:=last_nonblank; input_ln:=true;
  end;
end;
@y
@p function input_ln(var f:alpha_file;@!bypass_eoln:boolean):boolean;
  {inputs the NEXT LINE or returns |false|}
begin
  input_ln := inputln_actual(f,bypass_eoln,buffer,first,last,max_buf_stack,buf_size);
end;
@z

@x
procedure@?ins_the_toks; forward;@t\2@>
@y
procedure@?compare_strings; forward;@t\2@>
procedure@?do_filesize; forward;@t\2@>
procedure@?do_directjs; forward;@t\2@>
procedure@?pack_file_name(@!n,@!a,@!e:str_number); forward;@t\2@>
procedure@?ins_the_toks; forward;@t\2@>
@z


@x
The token list created by |str_toks| begins at |link(temp_head)| and ends
at the value |p| that is returned. (If |p=temp_head|, the list is empty.)

@p @t\4@>@<Declare \eTeX\ procedures for token lists@>@;@/
function str_toks(@!b:pool_pointer):pointer;
  {changes the string |str_pool[b..pool_ptr]| to a token list}
var p:pointer; {tail of the token list}
@!q:pointer; {new node being added to the token list via |store_new_token|}
@!t:halfword; {token being appended}
@!k:pool_pointer; {index into |str_pool|}
begin str_room(1);
p:=temp_head; link(p):=null; k:=b;
while k<pool_ptr do
  begin t:=so(str_pool[k]);
  if t=" " then t:=space_token
  else t:=other_token+t;
  fast_store_new_token(t);
  incr(k);
  end;
pool_ptr:=b; str_toks:=p;
end;
@y
The token list created by |str_toks| begins at |link(temp_head)| and ends
at the value |p| that is returned. (If |p=temp_head|, the list is empty.)

The |str_toks_cat| function is the same, except that the catcode |cat| is
stamped on all the characters, unless zero is passed in which case it
chooses |spacer| or |other_char| automatically.

@p @t\4@>@<Declare \eTeX\ procedures for token lists@>@;@/
function str_toks_cat(@!b:pool_pointer;@!cat:small_number):pointer;
  {changes the string |str_pool[b..pool_ptr]| to a token list}
var p:pointer; {tail of the token list}
@!q:pointer; {new node being added to the token list via |store_new_token|}
@!t:halfword; {token being appended}
@!k:pool_pointer; {index into |str_pool|}
begin str_room(1);
p:=temp_head; link(p):=null; k:=b;
while k<pool_ptr do
  begin t:=so(str_pool[k]);
  if cat=0 then begin
    if t=" " then t:=space_token
    else t:=other_token+t;
    end
  else begin
    if cat=active_char then t := cs_token_flag + active_base + t
    else t := 256 * cat + t;
  end;
  fast_store_new_token(t);
  incr(k);
  end;
pool_ptr:=b; str_toks_cat:=p;
end;

function str_toks(@!b:pool_pointer):pointer;
begin str_toks:=str_toks_cat(b,0); end;
@z

@x
@d etex_convert_codes=etex_convert_base+1 {end of \eTeX's command codes}
@d job_name_code=etex_convert_codes {command code for \.{\\jobname}}
@y
@d etex_convert_codes=etex_convert_base+1 {end of \eTeX's command codes}
@d ximeratex_first_expand_code = etex_convert_codes + 1 {base for \ximeratex's command codes}
@d pdf_strcmp_code = ximeratex_first_expand_code + 11 {command code for \.{\\pdfstrcmp}}
@d uchar_code = ximeratex_first_expand_code + 12 {command code for \.{\\Uchar}}
@d ucharcat_code = ximeratex_first_expand_code + 13 {command code for \.{\\Ucharcat}}
@d filesize_code = ximeratex_first_expand_code + 14 {command code for \.{\\filesize}}
@d kanjiskip_code = ximeratex_first_expand_code + 15 {command code for \.{\\kanjiskip}}
@d shellescape_code = ximeratex_first_expand_code + 16 {command code for \.{\\shellescape}}
@d directjs_code = ximeratex_first_expand_code + 17 {command code for \.{\\directjs}}
@d ximeratex_convert_codes = ximeratex_first_expand_code + 26 {end of \ximeratex's command codes}
@d job_name_code=ximeratex_convert_codes {command code for \.{\\jobname}}
@z

@x
primitive("jobname",convert,job_name_code);@/
@!@:job_name_}{\.{\\jobname} primitive@>
@y
primitive("strcmp",convert,pdf_strcmp_code);@/
@!@:pdf_strcmp_}{\.{\\pdfstrcmp} primitive@>
primitive("shellescape",convert,shellescape_code);@/
@!@:shellescape_}{\.{\\shellescape} primitive@>
primitive("filesize",convert,filesize_code);@/
@!@:filesize_}{\.{\\filesize} primitive@>
primitive("directjs",convert,directjs_code);@/
@!@:directjs_}{\.{\\directjs} primitive@>
primitive("kanjiskip",convert,kanjiskip_code);@/
@!@:kanjiskip_}{\.{\\kanjiskip} primitive@>
primitive("Uchar",convert,uchar_code);@/
@!@:uchar_}{\.{\\Uchar} primitive@>
primitive("Ucharcat",convert,ucharcat_code);@/
@!@:ucharcat_}{\.{\\Ucharcat} primitive@>
primitive("jobname",convert,job_name_code);@/
@!@:job_name_}{\.{\\jobname} primitive@>
@z

@x
  othercases print_esc("jobname")
@y
  pdf_strcmp_code: print_esc("pdfstrcmp");
  shellescape_code: print_esc("shellescape");  
  filesize_code: print_esc("filesize");
  directjs_code: print_esc("directjs");
  kanjiskip_code: print_esc("kanjiskip");    
  uchar_code: print_esc("Uchar");
  ucharcat_code: print_esc("Ucharcat");
  othercases print_esc("jobname")
@z

@x
@ The procedure |conv_toks| uses |str_toks| to insert the token list
for |convert| functions into the scanner; `\.{\\outer}' control sequences
are allowed to follow `\.{\\string}' and `\.{\\meaning}'.

@p procedure conv_toks;
var old_setting:0..max_selector; {holds |selector| setting}
@!c:number_code..job_name_code; {desired type of conversion}
@!save_scanner_status:small_number; {|scanner_status| upon entry}
@!b:pool_pointer; {base of temporary string}
begin c:=cur_chr; @<Scan the argument for command |c|@>;
@y
@ The procedure |conv_toks| uses |str_toks| to insert the token list
for |convert| functions into the scanner; `\.{\\outer}' control sequences
are allowed to follow `\.{\\string}' and `\.{\\meaning}'.

@d save_cur_string==if str_start[str_ptr]<pool_ptr then u:=make_string else u:=0
@d restore_cur_string==if u<>0 then decr(str_ptr)
@d illegal_Ucharcat_catcode(#)==(#<left_brace)or(#>active_char)or(#=out_param)or(#=ignore)

@p procedure conv_toks;
var old_setting:0..max_selector; {holds |selector| setting}
@!c:number_code..job_name_code; {desired type of conversion}
@!u: str_number;
@!s: str_number;
@!saved_chr:halfword;
@!save_warning_index, @!save_def_ref:pointer;
@!cat:small_number; {desired catcode, or 0 for automatic |spacer|/|other_char| selection}
@!save_scanner_status:small_number; {|scanner_status| upon entry}
@!b:pool_pointer; {base of temporary string}
begin c:=cur_chr; cat:=0; @<Scan the argument for command |c|@>;
@z

@x
selector:=old_setting; link(garbage):=str_toks(b); ins_list(link(temp_head));
@y
selector:=old_setting; link(garbage):=str_toks_cat(b,cat); ins_list(link(temp_head));
@z

@x
job_name_code: if job_name=0 then open_log_file;
@y
pdf_strcmp_code:
  begin
    save_scanner_status:=scanner_status;
    save_warning_index:=warning_index;
    save_def_ref:=def_ref;
    save_cur_string;
    compare_strings;
    def_ref:=save_def_ref;
    warning_index:=save_warning_index;
    scanner_status:=save_scanner_status;
    restore_cur_string;
  end;
shellescape_code: cur_val:=1;
filesize_code:
  begin
    save_scanner_status := scanner_status;
    save_warning_index := warning_index;
    save_def_ref := def_ref;
    save_cur_string;
    do_filesize;
    def_ref := save_def_ref;
    warning_index := save_warning_index;
    scanner_status := save_scanner_status;
    restore_cur_string;
  end;
directjs_code:
  begin
    save_scanner_status := scanner_status;
    save_warning_index := warning_index;
    save_def_ref := def_ref;
    save_cur_string;
    do_directjs;
    def_ref := save_def_ref;
    warning_index := save_warning_index;
    scanner_status := save_scanner_status;
    restore_cur_string;
  end;
kanjiskip_code: scan_int; { stub for now }
uchar_code: scan_int;
ucharcat_code:
  begin
    scan_int;
    saved_chr:=cur_val;
    scan_int;
    if illegal_Ucharcat_catcode(cur_val) then
      begin print_err("Invalid code ("); print_int(cur_val);
@.Invalid code@>
      print("), should be in the ranges 1..4, 6..8, 10..13");
      help1("I'm going to use 12 instead of that illegal code value.");@/
      error; cat:=12;
    end else
     cat:=cur_val;
    cur_val:=saved_chr;
  end;  
job_name_code: if job_name=0 then open_log_file;
@z

@x
job_name_code: print(job_name);
@y
pdf_strcmp_code: print_int(cur_val);
shellescape_code: print_int(cur_val);
filesize_code: print_int(cur_val);
directjs_code: begin end;
uchar_code, ucharcat_code: print_char(cur_val);
job_name_code: print(job_name);
@z

@x
@<Scan and build the body of the token list; |goto found| when finished@>;
found: scanner_status:=normal;
if hash_brace<>0 then store_new_token(hash_brace);
scan_toks:=p;
end;

@y
@<Scan and build the body of the token list; |goto found| when finished@>;
found: scanner_status:=normal;
if hash_brace<>0 then store_new_token(hash_brace);
scan_toks:=p;
end;

@ @d call_func(#) == begin if # <> 0 then do_nothing end
@d flushable(#) == (# = str_ptr - 1)

@p procedure flush_str(s: str_number); {flush a string if possible}
begin
    if flushable(s) then
        flush_string;
end;

function tokens_to_string(p: pointer): str_number; {return a string from tokens
list}
begin
  if selector = new_string then begin
    help1("tokens_to_string() called while selector = new_string"); error;
  end;
  old_setting:=selector; selector:=new_string;
  show_token_list(link(p),null,pool_size-pool_ptr);
  selector:=old_setting;
  tokens_to_string:=make_string;
end;

procedure compare_strings; {to implement \.{\\strcmp}}
label done;
var s1, s2: str_number;
  i1, i2, j1, j2: pool_pointer;
  save_cur_cs: pointer;
begin
  save_cur_cs:=cur_cs; call_func(scan_toks(false, true));
  s1:=tokens_to_string(def_ref);
  delete_token_ref(def_ref);
  cur_cs:=save_cur_cs; call_func(scan_toks(false, true));
  s2:=tokens_to_string(def_ref);
  delete_token_ref(def_ref);
  i1:=str_start[s1];
  j1:=str_start[s1 + 1];
  i2:=str_start[s2];
  j2:=str_start[s2 + 1];
  while (i1 < j1) and (i2 < j2) do begin
    if str_pool[i1] < str_pool[i2] then begin
      cur_val:=-1;
      goto done;
    end;
    if str_pool[i1] > str_pool[i2] then begin
      cur_val:=1;
      goto done;
    end;
    incr(i1);
    incr(i2);
  end;
  if (i1 = j1) and (i2 = j2) then
    cur_val:=0
  else if i1 < j1 then
    cur_val:=1
  else
    cur_val:=-1;
done:
  flush_str(s2);
  flush_str(s1);
  cur_val_level:=int_val;
end;

procedure do_filesize; {to implement \.{\\filesize}}
var s: str_number;
    save_cur_cs: pointer;
begin
  call_func(scan_toks(false, true));
  s:=tokens_to_string(def_ref);
  delete_token_ref(def_ref);

  pack_file_name(s,"","");

  cur_val := getfilesize(name_of_file);

  flush_str(s);
  cur_val_level:=int_val;
end;

procedure do_directjs; {to implement \.{\\directjs}}
var s: str_number;
    t: str_number;
    b: pool_pointer;
    save_cur_cs: pointer;
begin
  call_func(scan_toks(false, true));
  s:=tokens_to_string(def_ref);
  delete_token_ref(def_ref);
   
  b := pool_ptr;
  evaljs(s,str_pool,str_start,pool_ptr,pool_size,max_strings);
  t := make_string;

  link(garbage):=str_toks(b);
  ins_list(link(temp_head));
   
  flush_str(t);
  flush_str(s);
end;
@z
