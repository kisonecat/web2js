program TEST;
var
  i : integer;

function f : integer ;
begin
   f := 12*i;
end;

begin
   i := 17;
   writeln(f);
   i := 100;
   writeln(f);
end.
