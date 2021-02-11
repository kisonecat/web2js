@x
  othercases print_esc("jobname")
@y
  snapshot_code: print_esc("snapshot");
  othercases print_esc("jobname")
@z

@x
job_name_code: if job_name=0 then open_log_file;
@y
snapshot_code: snapshot(0);
job_name_code: if job_name=0 then open_log_file;  
@z

@x
job_name_code: print(job_name);
@y
snapshot_code: do_nothing;
job_name_code: print(job_name);
@z

@x
@* \[54] System-dependent changes.
@y
@* \[53x] snapshot macro

@<Generate all \eTeX...@>=
primitive("snapshot",convert,snapshot_code);@/
@!@:snapshot_}{\.{\\snapshot} primitive@>

@* \[54] System-dependent changes.
@z

