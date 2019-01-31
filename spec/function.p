program TEST;
var
  i : integer;

function f(x : integer) : integer ;
begin
   if x mod 2 = 0 then
      f := x div 2
   else
      f := 3*x + 1;
end;

begin
   i := 17;
   while i <> 1 do begin
      writeln(i);
      i := f(i);
   end;
end.
