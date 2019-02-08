program TEST;
var
  i : integer;

function f(x : integer) : integer ;
begin
   writeln('f(',x,')');
   if x mod 2 = 0 then
      f := x div 2
   else
      f := 3*x + 1;
   writeln('return');
end;

function g(x : integer ; y : integer) : integer ;
begin
   writeln('g(',x,',',y,')');   
   writeln('x=',x,' and y=',y);
   g := f(x+y) + y;
end;

begin
   i := 17;
   while i <> 1 do begin
      writeln(i);
      i := f(i);
   end;

   for i := 0 to 10 do begin
      writeln(g(i,3));
      writeln(g(4*i,3-i));
   end;
end.
