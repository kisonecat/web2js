program TEST;

label 10, 20;
   
var
  i,j : integer;

begin
   i := 0;
   for j := 0 to 5 do begin
      writeln(1234);
   10: i := i + 1;
   writeln(3*i+1);
   if i < 5 then goto 10 else goto 20;
   writeln(1717);
   20: writeln(1818);
   end;
end.
