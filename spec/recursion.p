program TEST;
var
  i : integer;

function g(x : integer; y : integer) : integer ; forward ;

function f(x : integer; y : integer) : integer ;
begin
   f := 3*x + g(x,y);
end;

function g(x : integer ; y : integer) : integer ;
begin
   g := x+y;
   if x < 10 then g := 5*f(x+y,y);
end;

begin
   for i := 0 to 10 do begin
      writeln(g(i,3));
   end;
end.
