@x
procedure@?ins_the_toks; forward;@t\2@>
@y
procedure@?scan_pdf_ext_toks; forward;@t\2@>
procedure@?ins_the_toks; forward;@t\2@>
@z

@x
  othercases print_esc("jobname")
@y
  expanded_code: print_esc("expanded");
  othercases print_esc("jobname")
@z

@x
job_name_code: if job_name=0 then open_log_file;
@y
expanded_code:
  begin
    save_scanner_status := scanner_status;
    save_warning_index := warning_index;
    save_def_ref := def_ref;
    save_cur_string;
    scan_pdf_ext_toks;
    warning_index := save_warning_index;
    scanner_status := save_scanner_status;
    ins_list(link(def_ref));
    def_ref := save_def_ref;
    restore_cur_string;
  end;
job_name_code: if job_name=0 then open_log_file;  
@z

@x
@* \[54] System-dependent changes.
@y
@* \[53x] expanded macro

@<Generate all \eTeX...@>=
primitive("expanded",convert,expanded_code);@/
@!@:expanded_}{\.{\\expanded} primitive@>

@ @<Declare \eTeX\ procedures for use by |main_control|@>=
procedure scan_pdf_ext_toks;
begin
  call_func(scan_toks(false, true)); 
end;

@* \[54] System-dependent changes.
@z

