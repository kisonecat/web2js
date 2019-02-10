program TEST;
label 10;
begin
   if 1 = 1 then begin
      writeln('yes');
      goto 10;
   end;

   writeln('no.');
   10:
end.
