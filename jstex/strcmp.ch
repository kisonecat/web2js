@x
procedure@?ins_the_toks; forward;@t\2@>
@y
procedure@?compare_strings; forward;@t\2@>
procedure@?ins_the_toks; forward;@t\2@>
@z

@x
  othercases print_esc("jobname")
@y
  strcmp_code: print_esc("strcmp");
  othercases print_esc("jobname")
@z

@x
job_name_code: if job_name=0 then open_log_file;
@y
strcmp_code:
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
job_name_code: if job_name=0 then open_log_file;  
@z

@x
job_name_code: print(job_name);
@y
strcmp_code: print_int(cur_val);
job_name_code: print(job_name);
@z


@x
@* \[54] System-dependent changes.
@y
@* \[53x] strcmp macro

@<Generate all \eTeX...@>=
primitive("strcmp",convert,strcmp_code);@/
@!@:strcmp_}{\.{\\strcmp} primitive@>

@ @<Declare \eTeX\ procedures for use by |main_control|@>=
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

@* \[54] System-dependent changes.
@z



