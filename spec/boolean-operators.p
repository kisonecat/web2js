program TEST;
var
  i : integer;
  t : boolean;
begin
   i := 17;
   if (3 > 5) and (5 > 9) then
      writeln(12)
   else
      writeln(15);
   t := 5 > 3;
   writeln(t);
   writeln(1 > 2);
   writeln(t);
   writeln(2 > 1);
   writeln(not (2 > 1));
end.
