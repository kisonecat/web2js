@x
  othercases print_esc("jobname")
@y
  jstex_revision_code: print_esc("jsTeXrevision");
  othercases print_esc("jobname")
@z

@x
job_name_code: if job_name=0 then open_log_file;
@y
jstex_revision_code: do_nothing;
job_name_code: if job_name=0 then open_log_file;
@z

@x
job_name_code: print(job_name);
@y
jstex_revision_code: print(jsTeX_revision);
job_name_code: print(job_name);
@z

@x
@* \[54] System-dependent changes.
@y
@* \[53x] version commands

@<Generate all \eTeX...@>=
primitive("jsTeXversion",last_item,jstex_version_code);
@!@:jstex_version_}{\.{\\jsTeXversion} primitive@>
primitive("jsTeXrevision",convert,jstex_revision_code);@/
@!@:jstex_revision_}{\.{\\jsTeXrevision} primitive@>

@ @<Cases of |last_item| for |print_cmd_chr|@>=
jstex_version_code: print_esc("jsTeXversion");

@ @<Cases for fetching an integer value@>=
jstex_version_code: cur_val:=jsTeX_version;

@* \[54] System-dependent changes.
@z

