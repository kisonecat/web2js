@x
  begin write_ln(term_out,'Buffer size exceeded!'); goto final_end;
@y
  begin write_ln(term_out,'Buffer size exceeded!'); uexit(0);
@z

@x Indeed, some \PASCAL\ compilers do not implement non-local |goto| statements.
@ The |jump_out| procedure just cuts across all active procedure levels and
goes to |end_of_TEX|. This is the only nontrivial |@!goto| statement in the
whole program. It is used when there is no recovery from a particular error.

Some \PASCAL\ compilers do not implement non-local |goto| statements.
@^system dependencies@>
In such cases the body of |jump_out| should simply be
`|close_files_and_terminate|;\thinspace' followed by a call on some system
procedure that quietly terminates the program.

@<Error hand...@>=
procedure jump_out;
begin goto end_of_TEX;
end;
@y
@ The |jump_out| procedure just cuts across all active procedure levels.

@^system dependencies@>

@<Error hand...@>=
procedure jump_out;
begin
  close_files_and_terminate;
  update_terminal;
  ready_already:=0;
  uexit(0);
end;
@z


