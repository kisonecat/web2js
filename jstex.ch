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

% Code for primitives like \strcmp was taken from the XeTeX
% typesetting system, which is

% Copyright (c) 1994-2008 by SIL International
% Copyright (c) 2009-2012 by Jonathan Kew
% Copyright (c) 2010-2012 by Han Han The Thanh
% Copyright (c) 2012-2013 by Khaled Hosny

% Permission is hereby granted, free of charge, to any person obtaining a copy
% of this software and associated documentation files (the "Software"), to deal
% in the Software without restriction, including without limitation the rights
% to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
% copies of the Software, and to permit persons to whom the Software is
% furnished to do so, subject to the following conditions:

% The above copyright notice and this permission notice shall be included in all
% copies or substantial portions of the Software.

% THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
% IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
% FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
% COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
% IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
% CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

% Except as contained in this notice, the name of the copyright holders shall
% not be used in advertising or otherwise to promote the sale, use or other
% dealings in this Software without prior written authorization from the
% copyright holders.
@z

@x
% This program is directly derived from Donald E. Knuth's TeX;
@y
% This program is indirectly derived from Knuth's TeX via e-TeX.
@z

@x
The token list created by |str_toks| begins at |link(temp_head)| and ends
at the value |p| that is returned. (If |p=temp_head|, the list is empty.)

@p @t\4@>@<Declare \eTeX\ procedures for token lists@>@;@/
function str_toks(@!b:pool_pointer):pointer;
  {converts |str_pool[b..pool_ptr-1]| to a token list}
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
primitive("jobname",convert,job_name_code);@/
@!@:job_name_}{\.{\\jobname} primitive@>
@y
primitive("shellescape",convert,shellescape_code);@/
@!@:shellescape_}{\.{\\shellescape} primitive@>
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
  shellescape_code: print_esc("shellescape");  
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
shellescape_code: cur_val:=1;
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
shellescape_code: print_int(cur_val);
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
@z
