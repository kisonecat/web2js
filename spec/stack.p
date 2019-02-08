program TEST;

function f(x : integer) : integer ;
begin
   writeln(x);
   if x > 5000 then
      f := 17
   else
      f := f(x+1);
end;

begin
   f(0);
end.
