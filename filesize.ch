@x
procedure@?ins_the_toks; forward;@t\2@>
@y
procedure@?do_filesize; forward;@t\2@>
procedure@?pack_file_name(@!n,@!a,@!e:str_number); forward;@t\2@>
procedure@?ins_the_toks; forward;@t\2@>
@z

@x
  othercases print_esc("jobname")
@y
  filesize_code: print_esc("filesize");
  othercases print_esc("jobname")
@z

@x
job_name_code: if job_name=0 then open_log_file;
@y
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
job_name_code: if job_name=0 then open_log_file;  
@z

@x
job_name_code: print(job_name);
@y
filesize_code: print_int(cur_val);
job_name_code: print(job_name);
@z

@x
@* \[54] System-dependent changes.
@y
@* \[53x] expanded macro

@<Generate all \eTeX...@>=
primitive("filesize",convert,filesize_code);@/
@!@:filesize_}{\.{\\filesize} primitive@>

@ @<Declare \eTeX\ procedures for use by |main_control|@>=
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

@* \[54] System-dependent changes.
@z
