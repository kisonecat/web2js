@x
  othercases print_esc("jobname")
@y
  shellescape_code: print_esc("shellescape");
  othercases print_esc("jobname")
@z

@x Read-only status indicating ‘shell escape’ allowed. Expands to zero for off.
job_name_code: if job_name=0 then open_log_file;
@y
shellescape_code: cur_val:=0;
job_name_code: if job_name=0 then open_log_file;
@z

@x
job_name_code: print(job_name);
@y
shellescape_code: print_int(cur_val);
job_name_code: print(job_name);
@z

@x
@* \[54] System-dependent changes.
@y
@* \[53x] shellescape

@<Generate all \eTeX...@>=
primitive("shellescape",convert,shellescape_code);@/
@!@:shellescape_}{\.{\\shellescape} primitive@>

@* \[54] System-dependent changes.
@z

