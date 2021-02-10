@x
  othercases print_esc("jobname")
@y
  uchar_code: print_esc("Uchar");
  ucharcat_code: print_esc("Ucharcat");
  othercases print_esc("jobname")
@z

@x
job_name_code: if job_name=0 then open_log_file;
@y
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
uchar_code, ucharcat_code: print_char(cur_val);
job_name_code: print(job_name);
@z

@x
@* \[54] System-dependent changes.
@y
@* \[53x] Uchar and Ucharcat

@<Generate all \eTeX...@>=
primitive("Uchar",convert,uchar_code);@/
@!@:uchar_}{\.{\\Uchar} primitive@>
primitive("Ucharcat",convert,ucharcat_code);@/
@!@:ucharcat_}{\.{\\Ucharcat} primitive@>

@* \[54] System-dependent changes.
@z

