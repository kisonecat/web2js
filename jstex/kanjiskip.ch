% This is a STUB so that kanjiskip is defined.

@x
  othercases print_esc("jobname")
@y
  kanjiskip_code: print_esc("kanjiskip");    
  othercases print_esc("jobname")
@z

@x
job_name_code: if job_name=0 then open_log_file;
@y
kanjiskip_code: scan_int; { stub for now }
job_name_code: if job_name=0 then open_log_file;  
@z

@x
job_name_code: print(job_name);
@y
kanjiskip_code: print_int(cur_val);
job_name_code: print(job_name);
@z

@x
@* \[54] System-dependent changes.
@y
@* \[53x] kanjiskip

@<Generate all \eTeX...@>=
primitive("kanjiskip",convert,kanjiskip_code);@/
@!@:kanjiskip_}{\.{\\kanjiskip} primitive@>

@* \[54] System-dependent changes.
@z

