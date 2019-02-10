program TEST;

label 20;
   
var
  i,j : integer;

begin
   i := 0;
   for j := 0 to 3 do begin
      i := i + 5;
      writeln(i);
      goto 20;
      i := i + 7;      
      20:
   end;
   writeln(i);
end.
