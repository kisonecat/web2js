program TEST;

label 10, 20;
   
var
  i : integer;

begin
   writeln(1234);      
i := 0;
   10: i := i + 1;
   writeln(3*i+1);
   if i < 5 then goto 10 else goto 20;
   writeln(1717);
   20: writeln(1818);
end.
